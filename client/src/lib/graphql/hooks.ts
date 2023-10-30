import { useMutation, useQuery } from '@apollo/client';
import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from './queries';

export function useCompany(id: string) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id: string) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs(limit?: number, offset?: number) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: 'network-only', // postoji i cache-first
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title: string, description?: string) => {
    const { data: { job } } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {  // ovo se radi da bi se koristili podaci iz kesa za prikaz ovog posla. - znaci ne pravi se nov request za getJobById vec se koriste podaci koji su dobijeni prilikom kreiranja posla
        cache.writeQuery({
          query: jobByIdQuery,  // pravi se kes za jobByIdQuery query
          variables: { id: data.job.id }, // varijavle ja ista kao za jobByIdQuery quey
          data, // ovi podaci se zapravo kesiraju
        });
      },
    });
    return job;
  };

  return {
    createJob,
    loading,
  };
}
