import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton component", () => {
  it("RENDERS CORRECTLY WHEN USER IN NOT AUTHENTICATED", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("RENDERS CORRECTLY WHEN USER IN AUTHENTICATED", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "johndoe@johndoe.com",
          image: "https://avatars.githubusercontent.com/u/64497059?v=4",
        },
        expires: "fake-expires",
      },
      false,
    ]);
    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
