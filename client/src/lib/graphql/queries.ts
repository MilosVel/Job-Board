import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';
import { graphql } from '../../generated';

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => { // za sve requestove se stavlja token
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});
// //     on Job => sa ovim kazemo na koji object type  it will be applied
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jobDetailFragment = graphql(`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`);

//////     Ovako bi bilo da se koristi vanilla js
// //     on Job => sa ovim kazemo na koji object type  it will be applied
// const jobDetailFragment = gql`
//   fragment JobDetail on Job { 
//     id
//     date
//     title
//     company {
//       id
//       name
//     }
//     description
//   }
// `;

export const companyByIdQuery = graphql(`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`);

// JobById je ime queria
export const jobByIdQuery = graphql(`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
`);

// Jobs je ime queria
export const jobsQuery = graphql(`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`);


// ovde je createJob preimenovan u job. Probati da se izbrise job
export const createJobMutation = graphql(`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
`);
