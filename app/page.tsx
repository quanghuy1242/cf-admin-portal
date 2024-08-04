import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withPageAuthRequired(
  async function Home() {
    const session = await getSession();

    if (!session) {
      return <a href="/api/auth/login">Login</a>;
    }

    const { user } = session;

    return (
      <>
        <h1>{JSON.stringify(user, null, 2)}</h1>
        <a href="/api/auth/logout">Logout</a>
      </>
    );
  },
  { returnTo: "/" },
);

export const runtime = "edge";
