import React from "react";
import Logo from "./logo/Logo";
import Medias from "./medias/Medias";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, auth } from "../auth";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export default async function Nav() {
  const session = await auth();

  async function storeUserIfNew() {
    if (session?.user) {
      const { name, email } = session.user;

      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .get();

      if (!existingUser) {
        await db.insert(usersTable).values({ name, email });
      }
    }
  }

  async function getAllUsers() {
    const users = await db.select().from(usersTable);
    return users;
  }

  const users = await getAllUsers();
  //console.log(users);

  if (session) {
    await storeUserIfNew();
  }

  return (
    <header className=" flex flex-wrap border border-transparent shadow-white bg-black gap-10 justify-center py-4 md:justify-evenly md:gap-0">
      
      <div className=" self-center">
        <Logo />
      </div>

      <div className=" self-center">
        <Medias />
      </div>

      <div className=" self-center flex flex-wrap justify-center gap-2">
        {!session?.user ? (
          <form
            className=" self-center"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className=" self-center font-semibold border border-transparent text-white px-5 py-2 bg-red-900 rounded-[25px] hover:bg-orange-800 duration-300"
            >
              Signin to create a post
            </button>
          </form>
        ) : (
          <div className=" self-center flex flex-wrap justify-center gap-4">
            <div className=" self-center flex flex-row font-bold gap-1 md:border border-gray-500 md:px-4 md:py-2 md:rounded-[25px] md:gap-2">
              <Image
                src={session?.user?.image}
                alt={session?.user?.name}
                width={30}
                height={30}
                className=" self-center object-cover rounded-[50%]"
              />
              <p className=" self-center text-white">{session?.user?.name}</p>
            </div>

            <Link className=" self-center" href={"/create-post"}>
              <button className=" border border-transparent font-semibold text-white bg-orange-900 px-5 py-2 rounded-[25px] hover:bg-orange-800 duration-300">
                Create Post
              </button>
            </Link>

            <form
              className=" self-center"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className=" self-center font-semibold border border-transparent text-white px-5 py-2 bg-indigo-900 rounded-[25px] hover:bg-indigo-800 duration-300"
              >
                Sign Out
              </button>
            </form>
          </div>
        )}

        <Link
          className=" self-center text-white mt-5 md:mt-0"
          href={"/contact"}
        >
          <button className="border font-semibold border-transparent px-5 py-2 bg-blue-950 rounded-[25px] hover:bg-blue-900 duration-300">
            Contact us
          </button>
        </Link>
      </div>
    </header>
  );
}
