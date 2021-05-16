using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Theses.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Core.Models.Dto.Thesis;
using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Theses
{
    [Authorize(AuthorizationPolicies.AtLeastDefault)]
    public class ThesesController : ApiControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        private readonly UsosServiceOptions _usosOptions;
        private readonly ApplicationOptions _appOptions;
        private readonly IAsyncRepository<Keyword> _keywordRepository;
        private readonly IAsyncRepository<Review> _reviewRepository;

        private readonly IThesisRepository _thesisRepository;
        private readonly IUserRepository _userRepository;

        private readonly IFileService _fileService;
        public ThesesController(IUsosService usosService, IMapper mapper, IOptions<UsosServiceOptions> usosOptions,
            IOptions<ApplicationOptions> appOptions, IUserRepository userRepository,
            IThesisRepository thesisRepository, IAsyncRepository<Review> reviewRepository,
            IAsyncRepository<Keyword> keywordRepository, IFileService fileService)
        {
            _usosService = usosService;
            _mapper = mapper;
            _usosOptions = usosOptions.Value;
            _appOptions = appOptions.Value;
            _userRepository = userRepository;
            _thesisRepository = thesisRepository;
            _keywordRepository = keywordRepository;
            _reviewRepository = reviewRepository;
            _fileService = fileService;
        }

        [HttpGet("promoted")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> GetPromotedTheses()
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var currentTerm = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());

            var theses = _thesisRepository.GetAll()
                .Where(p => p.Promoter == currentUser && p.TermId == currentTerm.Id)
                .Select(p => new ThesisBasicDTO
                {
                    Guid = p.Guid,
                    Title = p.Title,
                    Actions = new ThesisActionsDTO
                    {
                        CanView = true,
                        CanEdit = true,
                        CanPrint = true,
                        CanDownload = true,
                        CanAddReview = !p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser),
                        CanEditReview = p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser)
                    }
                }).ToList();

            return new OkObjectResult(theses);
        }

        [HttpGet("reviewed")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> GetReviewedTheses()
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var currentTerm = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());

            var theses = _thesisRepository.GetAll()
                .Where(p => p.Reviewer == currentUser && p.TermId == currentTerm.Id)
                .Select(p => new ThesisBasicDTO
                {
                    Guid = p.Guid,
                    Title = p.Title,
                    Actions = new ThesisActionsDTO
                    {
                        CanView = true,
                        CanEdit = false,
                        CanPrint = true,
                        CanDownload = true,
                        CanAddReview = !p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser),
                        CanEditReview = p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser)
                    }
                }).ToList();

            return new OkObjectResult(theses);
        }

        [HttpGet("authored")]
        public async Task<IActionResult> GetAuthoredTheses()
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var currentTerm = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());

            var theses = _thesisRepository.GetAll()
                .Where(p => p.ThesisAuthors.Select(p => p.Author).Contains(currentUser) && p.TermId == currentTerm.Id)
                .Select(p => new ThesisBasicDTO
                {
                    Guid = p.Guid,
                    Title = p.Title,
                    Actions = new ThesisActionsDTO
                    {
                        CanView = true,
                        CanPrint = true,
                        CanDownload = true,
                    }
                }).ToList();

            var thesesDto = _mapper.Map<List<ThesisBasicDTO>>(theses);

            return new OkObjectResult(thesesDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetTheses()
        {
            var currentUserAccessType = HttpContext.CurrentUserAccessType();
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var currentTerm = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var isAdminOrEmployee = currentUserAccessType == AccessType.Admin || currentUserAccessType == AccessType.Employee;

            var theses = _thesisRepository.GetAll()
                .Where(p => p.TermId == currentTerm.Id)
                .Select(p => new ThesisBasicDTO
                {
                    Guid = p.Guid,
                    Title = p.Title,
                    Actions = new ThesisActionsDTO
                    {
                        CanView = isAdminOrEmployee || p.ThesisAuthors.Select(a => a.Author).Contains(currentUser),
                        CanPrint = isAdminOrEmployee || p.ThesisAuthors.Select(a => a.Author).Contains(currentUser),
                        CanDownload = isAdminOrEmployee || p.ThesisAuthors.Select(a => a.Author).Contains(currentUser),
                        CanEdit = p.Promoter == currentUser,
                        CanAddReview = (p.Reviewer == currentUser || p.Promoter == currentUser) &&
                            !p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser),
                        CanEditReview = (p.Reviewer == currentUser || p.Promoter == currentUser) &&
                            p.Reviews.Any(r => r.ThesisId == p.Id && r.CreatedBy == currentUser),
                    }
                }).ToList();

            return new OkObjectResult(theses);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetThesis(Guid id)
        {
            var thesis = await _thesisRepository.GetAsync(id);

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            var currentUserAccessType = HttpContext.CurrentUserAccessType();
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());

            var isAuthor = thesis.ThesisAuthors.Select(p => p.AuthorId).Contains(currentUser.Id);
            var isReviewer = thesis.Reviewer.Id == currentUser.Id;
            var isPromoter = thesis.Promoter.Id == currentUser.Id;

            if (currentUserAccessType == AccessType.Default && !isAuthor && !isReviewer && !isPromoter)
            {
                return new ForbidResult();
            }

            var oauthRequest = HttpContext.BuildOAuthRequest();
            //TODO: Run in parallel
            var promoter = await _usosService.GetUser(oauthRequest, thesis.Promoter.UsosId);
            var reviewer = await _usosService.GetUser(oauthRequest, thesis.Reviewer.UsosId);
            var authors = await _usosService.GetUsers(oauthRequest, thesis.ThesisAuthors.Select(p => p.Author.UsosId));

            //Mapping
            var thesisDto = _mapper.Map<ThesisDTO>(thesis);
            thesisDto.ThesisAuthors = _mapper.Map<List<UserDTO>>(authors);
            thesisDto.Promoter = _mapper.Map<UserDTO>(promoter);
            thesisDto.Reviewer = _mapper.Map<UserDTO>(reviewer);
            thesisDto.Actions = new ThesisActionsDTO
            {
                //TODO: Check if review exists
                CanAddReview = true,
                CanDownload = true,
                CanEdit = isPromoter,
                //TODO: Check if review exists
                CanEditReview = true,
                CanPrint = true,
                CanView = true
            };
            foreach (var additionalFile in thesisDto.ThesisAdditionalFiles)
            {
                additionalFile.Actions = new ThesisFileActionsDTO
                {
                    CanDelete = isPromoter,
                    CanDownload = true
                };
            };

            if (currentUser.AccessType != AccessType.Default)
            {
                var usosUsersFromLogs = await _usosService.GetUsers(oauthRequest, thesis.ThesisLogs.Select(p => p.User.UsosId));
                var usersFromLogs = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsersFromLogs);

                thesisDto.ThesisLogs = thesis.ThesisLogs.Select(p => new ThesisLogDTO
                {
                    Timestamp = p.Timestamp,
                    ModificationType = p.ModificationType,
                    User = usersFromLogs.FirstOrDefault(u => u.UsosId == p.User.UsosId)
                }).ToList();
            }

            return new OkObjectResult(thesisDto);
        }

        [HttpPost]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> CreateThesis([FromForm] ThesisRequest request)
        {
            var requestData = JsonConvert.DeserializeObject<ThesisRequestData>(request.Data);

            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentUserUsosId = HttpContext.CurrentUserUsosId();
            var currentTermId = await _usosService.GetCurrentTerm(oauthRequest);

            if (currentUserUsosId == requestData.ReviewerUsosId)
            {
                return new BadRequestObjectResult("Promoter cannot be a reviever at the same time.");
            }

            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());

            //Getting/Creating users
            var promoter = currentUser;
            var reviewer = await _userRepository.GetAsync(requestData.ReviewerUsosId);

            if (reviewer == null)
            {
                var usosUser = await _usosService.GetUser(oauthRequest, requestData.ReviewerUsosId);
                if (usosUser == null)
                {
                    return new BadRequestObjectResult("User does not exist.");
                }

                reviewer = _mapper.Map<UsosUser, User>(usosUser);
            }

            var authors = _userRepository.GetAll().Where(p => requestData.AuthorUsosIds.Contains(p.UsosId)).ToList();
            if (authors.Count != requestData.AuthorUsosIds.Count)
            {
                var newUsers = requestData.AuthorUsosIds.Where(p => !authors.Select(a => a.UsosId).Contains(p));
                var newUsosUsers = await _usosService.GetUsers(HttpContext.BuildOAuthRequest(), newUsers);
                if (newUsosUsers.Any(p => p == null))
                {
                    return new BadRequestObjectResult("User does not exist.");
                }
                var newAuthors = _mapper.Map<List<User>>(newUsosUsers);
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
                    CreatedBy = currentUser
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
                    User = currentUser
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
                CreatedBy = currentUser,
                Size = request.ThesisFile.Length,
                Checksum = _fileService.GenerateChecksum(request.ThesisFile.OpenReadStream())
            };
            await _fileService.SaveFile(request.ThesisFile.OpenReadStream(), thesisGuid.ToString(), fileGuid.ToString());

            //var additionalFiles = new List<ThesisAdditionalFile>();
            //foreach (var additonalFile in request.AdditionalThesisFiles)
            //{
            //    var additionalFileGuid = Guid.NewGuid();
            //    additionalFiles.Add(new ThesisAdditionalFile()
            //    {
            //        File = new Core.Models.DbModels.File
            //        {
            //            Guid = additionalFileGuid,
            //            FileName = additonalFile.FileName,
            //            Extension = Path.GetExtension(additonalFile.FileName),
            //            Path = Path.Combine(thesisGuid.ToString(), additionalFileGuid.ToString()),
            //            ContentType = additonalFile.ContentType,
            //            CreatedBy = currentUser,
            //            Size = additonalFile.Length,
            //            Checksum = GetFileChecksum(additonalFile.OpenReadStream())
            //        }
            //    });
            //}

            var thesis = new Thesis()
            {
                Guid = thesisGuid,
                TermId = currentTermId.Id,
                Title = requestData.Title,
                Abstract = requestData.Abstract,
                Promoter = promoter,
                Reviewer = reviewer,
                ThesisAuthors = thesisAuthors,
                ThesisKeywords = thesisKeywords,
                ThesisLogs = thesisLogs,
                File = thesisFile,
                //ThesisAdditionalFiles = additionalFiles,
                CreatedBy = currentUser,
            };

            await _thesisRepository.AddAsync(thesis);

            return new OkObjectResult(thesisGuid);
        }

        [HttpPut("{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> EditThesis(Guid id, [FromForm] ThesisRequest request)
        {
            var thesis = await _thesisRepository.GetAsync(id);
            var requestData = JsonConvert.DeserializeObject<ThesisRequestData>(request.Data);

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            var currentUserUsosId = HttpContext.CurrentUserUsosId();
            var currentUser = await _userRepository.GetAsync(currentUserUsosId);

            if (requestData.ReviewerUsosId == currentUserUsosId)
            {
                return new BadRequestResult();
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
                        return new BadRequestObjectResult("User does not exist.");
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
                        return new BadRequestObjectResult("User does not exist.");
                    }

                    reviewer = _mapper.Map<UsosUser, User>(usosUser);
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
                thesis.File.Size = request.ThesisFile.Length;
                thesis.File.Checksum = fileChecksum;

                await _fileService.SaveFile(request.ThesisFile.OpenReadStream(), thesis.Guid.ToString(), thesis.File.Guid.ToString());
            }

            thesis.ModifiedBy = currentUser;
            thesis.ModifiedAt = DateTime.Now;

            //foreach (var additonalFile in request.AdditionalThesisFiles)
            //{
            //    if (!Guid.TryParse(additonalFile.Headers["guid"], out var additonalFileGuid))
            //    {
            //        return new BadRequestObjectResult("Could not parse file guid");
            //    }

            //    thesis.ThesisAdditionalFiles.Fi
            //}

            await _thesisRepository.UpdateAsync(thesis);

            return new OkResult();
        }
    }
}
