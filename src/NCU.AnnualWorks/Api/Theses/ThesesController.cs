using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Theses.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Extensions.Mapping;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Core.Utils;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Theses
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class ThesesController : ApiControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        private readonly IAsyncRepository<Keyword> _keywordRepository;

        private readonly IThesisRepository _thesisRepository;
        private readonly IUserRepository _userRepository;

        private readonly IFileService _fileService;
        private readonly ISettingsService _settingsService;
        private readonly IThesisService _thesisService;

        private readonly IUserContext _userContext;

        public ThesesController(IUsosService usosService, IMapper mapper, IUserRepository userRepository,
            IThesisRepository thesisRepository, IAsyncRepository<Keyword> keywordRepository,
            IFileService fileService, ISettingsService settingsService, IThesisService thesisService,
            IUserContext userContext)
        {
            _usosService = usosService;
            _mapper = mapper;
            _userRepository = userRepository;
            _thesisRepository = thesisRepository;
            _keywordRepository = keywordRepository;
            _fileService = fileService;
            _settingsService = settingsService;
            _thesisService = thesisService;
            _userContext = userContext;
        }

        [HttpGet("promoted")]
        [Authorize(AuthorizationPolicies.LecturersOnly)]
        public async Task<IActionResult> GetPromotedTheses()
        {
            var currentUser = HttpContext.GetCurrentUser();

            var getCurrentTerm = _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var getDeadlne = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            await Task.WhenAll(getCurrentTerm, getDeadlne);

            var theses = _thesisService.GetPromotedTheses(currentUser.Id, getCurrentTerm.Result.Id);
            foreach (var thesis in theses)
            {
                thesis.Actions = await _thesisService.GetAvailableActions(thesis.Guid, getDeadlne.Result);
                thesis.ReviewGuid = await _thesisService.GetReviewGuid(thesis.Guid, currentUser.Id);
            }

            return new OkObjectResult(theses);
        }

        [HttpGet("reviewed")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> GetReviewedTheses()
        {
            var currentUser = HttpContext.GetCurrentUser();

            var getCurrentTerm = _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var getDeadlne = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            await Task.WhenAll(getCurrentTerm, getDeadlne);

            var theses = _thesisService.GetReviewedTheses(currentUser.Id, getCurrentTerm.Result.Id);
            foreach (var thesis in theses)
            {
                thesis.Actions = await _thesisService.GetAvailableActions(thesis.Guid, getDeadlne.Result);
                thesis.ReviewGuid = await _thesisService.GetReviewGuid(thesis.Guid, currentUser.Id);
            }

            return new OkObjectResult(theses);
        }

        [HttpGet("authored")]
        [Authorize(AuthorizationPolicies.AtLeastStudent)]
        public async Task<IActionResult> GetAuthoredTheses()
        {
            var currentUser = HttpContext.GetCurrentUser();

            var getCurrentTerm = _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var getDeadlne = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            await Task.WhenAll(getCurrentTerm, getDeadlne);

            var theses = _thesisService.GetAuthoredTheses(currentUser.Id, getCurrentTerm.Result.Id);
            foreach (var thesis in theses)
            {
                thesis.Actions = await _thesisService.GetAvailableActions(thesis.Guid, getDeadlne.Result);
                thesis.ReviewGuid = await _thesisService.GetReviewGuid(thesis.Guid, currentUser.Id);
            }

            return new OkObjectResult(theses);
        }

        [HttpGet]
        [Authorize(AuthorizationPolicies.AtLeastStudent)]
        public async Task<IActionResult> GetTheses()
        {
            var currentUser = HttpContext.GetCurrentUser();

            var getCurrentTerm = _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var getDeadlne = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            await Task.WhenAll(getCurrentTerm, getDeadlne);

            var theses = _thesisService.GetThesesByTerm(getCurrentTerm.Result.Id);
            foreach (var thesis in theses)
            {
                thesis.Actions = await _thesisService.GetAvailableActions(thesis.Guid, getDeadlne.Result);
                thesis.ReviewGuid = await _thesisService.GetReviewGuid(thesis.Guid, currentUser.Id);
            }

            return new OkObjectResult(theses);
        }

        [HttpGet("{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastStudent)]
        public async Task<IActionResult> GetThesis(Guid id)
        {
            if (!_thesisService.ThesisExists(id))
            {
                return new NotFoundResult();
            }

            var thesis = await _thesisRepository.GetAsync(id);
            var currentUser = HttpContext.GetCurrentUser();
            var isAuthor = thesis.ThesisAuthors.Select(p => p.AuthorId).Contains(currentUser.Id);
            var isReviewer = thesis.Reviewer.Id == currentUser.Id;
            var isPromoter = thesis.Promoter.Id == currentUser.Id;

            if (!isAuthor && !currentUser.IsEmployee)
            {
                return new ForbidResult();
            }

            var getDeadline = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            var getPromoter = _usosService.GetUser(HttpContext.BuildOAuthRequest(), thesis.Promoter.UsosId);
            var getReviewer = _usosService.GetUser(HttpContext.BuildOAuthRequest(), thesis.Reviewer.UsosId);
            var getAuthors = _usosService.GetUsers(HttpContext.BuildOAuthRequest(), thesis.ThesisAuthors.Select(p => p.Author.UsosId));
            await Task.WhenAll(getPromoter, getReviewer, getAuthors, getDeadline);

            //Mapping
            var thesisDto = thesis.ToDto();
            thesisDto.ThesisAuthors = getAuthors.Result.ToDto();
            thesisDto.Promoter = getPromoter.Result.ToDto();
            thesisDto.Reviewer = getReviewer.Result.ToDto();
            thesisDto.PromoterReview = thesis.Reviews.FirstOrDefault(p => p.CreatedBy == thesis.Promoter)?.ToBasicDto();
            thesisDto.ReviewerReview = thesis.Reviews.FirstOrDefault(p => p.CreatedBy == thesis.Reviewer)?.ToBasicDto();
            thesisDto.ReviewGuid = await _thesisService.GetReviewGuid(thesis.Guid, currentUser.Id);
            thesisDto.Actions = await _thesisService.GetAvailableActions(thesis.Guid, getDeadline.Result);

            if (currentUser.IsEmployee)
            {
                thesisDto.ThesisLogs = await _thesisService.GetThesisLogs(thesisDto.Guid);
            }

            return new OkObjectResult(thesisDto);
        }

        //TODO: To refactor
        [HttpPost]
        [Authorize(AuthorizationPolicies.LecturersOnly)]
        public async Task<IActionResult> CreateThesis([FromForm] ThesisRequest request)
        {
            var currentUser = HttpContext.GetCurrentUser();
            var getDeadline = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            var getCurrentTerm = _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            await Task.WhenAll(getCurrentTerm, getDeadline);

            if (DateTime.Now > getDeadline.Result)
            {
                return new BadRequestObjectResult("Nie można dodać pracy po upływie terminu końcowego.");
            }

            var requestData = JsonConvert.DeserializeObject<ThesisRequestData>(request.Data);
            if (currentUser.Id.ToString() == requestData.ReviewerUsosId)
            {
                return new ConflictObjectResult("Promotor nie może być jednocześnie recenzentem.");
            }

            //Getting/Creating users
            var promoter = await _userRepository.GetAsync(currentUser.Id);
            var reviewer = await _userRepository.GetAsync(requestData.ReviewerUsosId);

            if (reviewer == null)
            {
                var usosUser = await _usosService.GetUser(HttpContext.BuildOAuthRequest(), requestData.ReviewerUsosId);
                if (usosUser == null)
                {
                    return new BadRequestObjectResult("Użytkownik nie istnieje.");
                }

                reviewer = usosUser.ToDbModel();
                await _userRepository.AddAsync(reviewer);
            }

            var authors = _userRepository.GetAll().Where(p => requestData.AuthorUsosIds.Contains(p.UsosId)).ToList();
            if (authors.Count != requestData.AuthorUsosIds.Count)
            {
                var newUsers = requestData.AuthorUsosIds.Where(p => !authors.Select(a => a.UsosId).Contains(p));
                var newUsosUsers = await _usosService.GetUsers(HttpContext.BuildOAuthRequest(), newUsers);
                if (newUsosUsers.Any(p => p == null))
                {
                    return new BadRequestObjectResult("Użytkownik nie istnieje.");
                }
                var newAuthors = newUsosUsers.ToDbModel();
                await _userRepository.AddRangeAsync(newAuthors);
                authors.AddRange(newAuthors);
            }

            //Getting/Creating keywords
            var keywords = _keywordRepository.GetAll()
                .Where(p => requestData.Keywords.Select(k => k.Text).Contains(p.Text)).ToList();
            var newKeywords = requestData.Keywords.Select(k => k.Text)
                .Where(k => !keywords.Select(p => p.Text).Contains(k))
                .Select(k => new Keyword
                {
                    Text = k,
                    CreatedBy = promoter
                });
            if (newKeywords.Count() != 0)
            {
                keywords.AddRange(newKeywords);
            }

            //Preparing thesis object
            var thesisGuid = Guid.NewGuid();
            var thesisAuthors = new List<ThesisAuthor>(
                authors.Select(user => new ThesisAuthor
                {
                    Author = user
                }));
            var thesisKeywords = new List<ThesisKeyword>(
                keywords.Select(keyword => new ThesisKeyword
                {
                    Keyword = keyword
                }));
            var thesisLogs = new List<ThesisLog>
            {
                new ThesisLog
                {
                    ModificationType = ModificationType.Created,
                    User = promoter
                }
            };
            //TODO: Save files locally
            var fileGuid = Guid.NewGuid();
            var thesisFile = new Core.Models.DbModels.File
            {
                Guid = fileGuid,
                FileName = request.ThesisFile.FileName,
                Extension = Path.GetExtension(request.ThesisFile.FileName),
                Path = Path.Combine(thesisGuid.ToString(), fileGuid.ToString()),
                ContentType = request.ThesisFile.ContentType,
                CreatedBy = promoter,
                Size = request.ThesisFile.Length,
                Checksum = _fileService.GenerateChecksum(request.ThesisFile.OpenReadStream())
            };
            await _fileService.SaveFile(request.ThesisFile.OpenReadStream(), thesisGuid.ToString(), fileGuid.ToString());

            var thesis = new Thesis()
            {
                Guid = thesisGuid,
                TermId = getCurrentTerm.Result.Id,
                Title = requestData.Title,
                Abstract = requestData.Abstract,
                Promoter = promoter,
                Reviewer = reviewer,
                ThesisAuthors = thesisAuthors,
                ThesisKeywords = thesisKeywords,
                ThesisLogs = thesisLogs,
                File = thesisFile,
                CreatedBy = promoter,
            };

            await _thesisRepository.AddAsync(thesis);

            return new CreatedResult("/theses", thesisGuid);
        }

        //TODO: Refactor
        [HttpPut("{id:guid}")]
        [Authorize(AuthorizationPolicies.LecturersOnly)]
        public async Task<IActionResult> EditThesis(Guid id, [FromForm] ThesisRequest request)
        {
            var deadline = await _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            var currentUserUsosId = HttpContext.CurrentUserUsosId();
            var currentUser = await _userRepository.GetAsync(currentUserUsosId);
            if (DateTime.Now > deadline)
            {
                return new BadRequestObjectResult("Nie można zaktualizować pracy po upływie terminu końcowego.");
            }

            var thesis = await _thesisRepository.GetAsync(id);
            var requestData = JsonConvert.DeserializeObject<ThesisRequestData>(request.Data);

            if (thesis.Promoter.Id != currentUser.Id)
            {
                return new ForbidResult();
            }

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            if (thesis.Grade != null)
            {
                return new ConflictObjectResult("Nie można edytować pracy z wystawioną oceną.");
            }

            if (thesis.Reviews.Any(r => r.IsConfirmed) && !HttpContext.IsCurrentUserAdmin())
            {
                return new BadRequestObjectResult("Nie można edytować pracy z zatwierdzoną recenzją.");
            }

            if (requestData.ReviewerUsosId == currentUserUsosId.ToString())
            {
                return new ConflictObjectResult("Promotor nie może być jednocześnie recenzentem.");
            }


            if (thesis.Title != requestData.Title)
            {
                thesis.LogChange(currentUser, ModificationType.TitleChanged);
                thesis.Title = requestData.Title;
            }

            if (thesis.Abstract != requestData.Abstract)
            {
                thesis.LogChange(currentUser, ModificationType.AbstractChanged);
                thesis.Abstract = requestData.Abstract;
            }

            if (!thesis.ThesisKeywords.Select(p => p.Keyword.Text).All(requestData.Keywords.Select(p => p.Text).Contains))
            {
                thesis.LogChange(currentUser, ModificationType.KeywordsChanged);

                var keywords = _keywordRepository.GetAll()
                    .Where(p => requestData.Keywords.Select(k => k.Text).Contains(p.Text)).ToList();
                var newKeywords = requestData.Keywords.Select(k => k.Text)
                    .Where(k => !keywords.Select(p => p.Text).Contains(k))
                    .Select(k => new Keyword
                    {
                        Text = k,
                        CreatedBy = currentUser
                    });
                if (newKeywords.Count() != 0)
                {
                    keywords.AddRange(newKeywords);
                }

                thesis.ThesisKeywords = new List<ThesisKeyword>(
                keywords.Select(keyword => new ThesisKeyword
                {
                    Keyword = keyword
                }));
            }

            if (!thesis.ThesisAuthors.Select(p => p.Author.UsosId).All(requestData.AuthorUsosIds.Contains))
            {
                thesis.LogChange(currentUser, ModificationType.AuthorsChanged);

                var authors = _userRepository.GetAll().Where(p => requestData.AuthorUsosIds.Contains(p.UsosId)).ToList();
                if (authors.Count != requestData.AuthorUsosIds.Count)
                {
                    var newUsers = requestData.AuthorUsosIds.Where(p => !authors.Select(a => a.UsosId).Contains(p));
                    var newUsosUsers = await _usosService.GetUsers(HttpContext.BuildOAuthRequest(), newUsers);
                    if (newUsosUsers.Any(p => p == null))
                    {
                        return new BadRequestObjectResult("Użytkownik nie istnieje.");
                    }
                    var newAuthors = _mapper.Map<List<User>>(newUsosUsers);
                    await _userRepository.AddRangeAsync(newAuthors);
                    authors.AddRange(newAuthors);
                }

                thesis.ThesisAuthors = new List<ThesisAuthor>(
                    authors.Select(user => new ThesisAuthor
                    {
                        AuthorId = user.Id,
                        Author = user,
                        Thesis = thesis,
                        ThesisId = thesis.Id
                    }));
            }

            if (thesis.Reviewer.UsosId != requestData.ReviewerUsosId)
            {
                thesis.LogChange(currentUser, ModificationType.ReviewerChanged);

                var reviewer = await _userRepository.GetAsync(requestData.ReviewerUsosId);
                if (reviewer == null)
                {
                    var usosUser = await _usosService.GetUser(HttpContext.BuildOAuthRequest(), requestData.ReviewerUsosId);
                    if (usosUser == null)
                    {
                        return new BadRequestObjectResult("Użytkownik nie istnieje.");
                    }

                    reviewer = _mapper.Map<UsosUser, User>(usosUser);
                    await _userRepository.AddAsync(reviewer);
                }

                thesis.Reviewer = reviewer;
            }

            var fileChecksum = _fileService.GenerateChecksum(request.ThesisFile.OpenReadStream());
            if (thesis.File.Checksum != fileChecksum)
            {
                thesis.LogChange(currentUser, ModificationType.FileChanged);

                thesis.File.FileName = request.ThesisFile.FileName;
                thesis.File.Extension = Path.GetExtension(request.ThesisFile.FileName);
                thesis.File.ContentType = request.ThesisFile.ContentType;
                thesis.File.ModifiedBy = currentUser;
                thesis.File.ModifiedAt = DateTime.Now;
                thesis.File.Size = request.ThesisFile.Length;
                thesis.File.Checksum = fileChecksum;

                await _fileService.SaveFile(request.ThesisFile.OpenReadStream(), thesis.Guid.ToString(), thesis.File.Guid.ToString());
            }

            if (thesis.Reviews.Any(r => r.IsConfirmed))
            {
                foreach (var review in thesis.Reviews)
                {
                    review.IsConfirmed = false;
                }
            }

            thesis.ModifiedBy = currentUser;
            thesis.ModifiedAt = DateTime.Now;

            await _thesisRepository.UpdateAsync(thesis);

            return new OkObjectResult(thesis.Guid);
        }

        //TODO: Refactor
        [HttpPost("grade/{id:guid}")]
        [Authorize(AuthorizationPolicies.LecturersOnly)]
        public async Task<IActionResult> ConfirmGrade(Guid id, [FromBody] ConfirmGradeRequest request)
        {
            var currentUser = HttpContext.GetCurrentUser();
            var getDeadline = _settingsService.GetDeadline(HttpContext.BuildOAuthRequest());
            var getThesis = _thesisRepository.GetAsync(id);
            await Task.WhenAll(getDeadline, getThesis);

            var deadline = getDeadline.Result;
            var thesis = getThesis.Result;

            if (DateTime.Now > deadline)
            {
                return new BadRequestObjectResult("Nie wystawić oceny po upływie terminu końcowego.");
            }

            var regex = new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)");

            var isPromoter = thesis.Promoter.Id == currentUser.Id;
            var promoterReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Promoter);
            var reviewerReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Reviewer);
            var canBeAveraged = GradeUtils.TryGetAverageGrade(new List<string>() { promoterReview.Grade, reviewerReview.Grade }, out var grade);

            if (isPromoter &&
                thesis.Grade == null &&
                promoterReview != null &&
                reviewerReview != null &&
                promoterReview.IsConfirmed &&
                reviewerReview.IsConfirmed &&
                !canBeAveraged &&
                regex.IsMatch(request.Grade))
            {
                thesis.Grade = request.Grade;
                thesis.LogChange(thesis.Promoter, ModificationType.GradeConfirmed);
                await _thesisRepository.UpdateAsync(thesis);

                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult("Ocena została już wystawiona lub nie posiadasz uprawnień do jej wystawienia.");
            }
        }

        [HttpPost("hide/{id:guid}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> HideThesis(Guid id)
        {
            var thesis = await _thesisRepository.GetAsync(id);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            if (thesis.Hidden)
            {
                return new BadRequestObjectResult("Praca została już ukryta.");
            }

            thesis.LogChange(user, ModificationType.Hidden);
            thesis.Hidden = true;
            await _thesisRepository.UpdateAsync(thesis);

            return new OkResult();
        }

        [HttpPost("unhide/{id:guid}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UnhideThesis(Guid id)
        {
            var thesis = await _thesisRepository.GetAsync(id);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            if (!thesis.Hidden)
            {
                return new BadRequestObjectResult("Praca nie jest ukryta.");
            }

            thesis.LogChange(user, ModificationType.Visible);
            thesis.Hidden = false;
            await _thesisRepository.UpdateAsync(thesis);

            return new OkResult();
        }

        [HttpGet("search")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> SearchTheses(
            [FromQuery] string terms,
            [FromQuery] string text,
            [FromQuery] string users,
            [FromQuery] string keywords,
            [FromQuery] int page,
            [FromQuery] int count)
        {
            var termIds = terms?.Split(';');
            var userIds = users?.Split(';');
            var keywordIds = keywords?.Split(';');

            var query = _thesisRepository.GetAll().Where(t => !t.Hidden);

            query = termIds == null ? query : query.Where(t => termIds.Contains(t.TermId));
            query = text == null ? query : query.Where(t =>
                t.Title.Contains(text) ||
                t.Abstract.Contains(text)); //||
                                            //keywordIds.Contains(t.ThesisKeywords.Select(k => k.KeywordId).ToString()));
            query = userIds == null ? query : query.Where(t =>
                userIds.Contains(t.Promoter.Id.ToString()) ||
                userIds.Contains(t.Reviewer.Id.ToString()) ||
                userIds.Contains(t.ThesisAuthors.Select(a => a.AuthorId).ToString()));
            query = keywordIds == null ? query : query.Where(t => keywordIds.Contains(t.ThesisKeywords.Select(k => k.KeywordId).ToString()));

            var result = query.ToExtendedDto();
            var resultCount = result.Count;

            return new OkObjectResult(new
            {
                theses = result.Skip(page * count).Take(count).ToList(),
                itemCount = resultCount
            });
        }
    }
}
