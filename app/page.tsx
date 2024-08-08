import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Button from "antd/lib/button";

export default withPageAuthRequired(
  async function Home() {
    const session = await getSession();

    if (!session) {
      return <a href="/api/auth/login">Login</a>;
    }

    const { user } = session;

    return (
      <div>
        <h1>{JSON.stringify(user, null, 2)}</h1>
        <Button href="/api/auth/logout">Logout</Button>
      </div>
    );
  },
  { returnTo: "/" },
);

export const runtime = "edge";
