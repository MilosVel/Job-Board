import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { ResolverContext, resolvers } from './resolvers.js';
import { createCompanyLoader } from './db/companies.js';
import { getUser } from './db/users.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);// ovaj authMiddleware dodaje auth property na req objekat

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf8');

async function getContext({ req }): Promise<ResolverContext> {
  const companyLoader = createCompanyLoader(); // ovde se kreira companyLoader za svaki request, i taj companyLoader je kroz kontekst dostupan resolverima
  const context: ResolverContext = { companyLoader };
  if (req.auth) {// req.auth ce se kreirati samo ako se posalje validan token. Ovaj auth properti kreira authMiddleware
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext })); // drugi argument ovog apolloMiddleware je vidljiv u resolvers.js u mutacijama (u resolverima je vidljiva samo vrednost context propertia)

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
