export namespace RouteNames {
  export const root = '/';
  export const about = '/about';
  export const privacy = '/privacy';
  export const signOut = '/signout';
  export const signIn = '/sign-in';
  export const authorize = '/authorize';
  export const details = '/details/:guid';
  export const detailsPath = (guid: string) => details.replace(':guid', guid);
  export const addThesis = '/add-thesis';
  export const editThesis = '/edit-thesis/:guid';
  export const editThesisPath = (guid: string) => editThesis.replace(':guid', guid);
  export const addReview = '/add-review/:thesisGuid';
  export const addReviewPath = (thesisGuid: string) => addReview.replace(':thesisGuid', thesisGuid);
  export const editReview = '/edit-review/:thesisGuid/:reviewGuid';
  export const editReviewPath = (thesisGuid: string, reviewGuid: string) => 
    editReview.replace(':thesisGuid', thesisGuid).replace(':reviewGuid', reviewGuid);
  export const notFound = '/404';
  export const forbidden = '/forbidden';
  export const error = '/error';
  export const search = '/search';
};