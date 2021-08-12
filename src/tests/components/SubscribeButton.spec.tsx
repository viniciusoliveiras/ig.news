import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession, signIn } from "next-auth/client";
import React from "react";
import { SubscribeButton } from "../../components/SubscribeButton";
import { useRouter } from "next/router";

jest.mock("next-auth/client");
jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("RENDERS CORRECTLY ", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("REDIRECTS USER TO SIGN IN WHEN NOT AUTHENTICATED", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("REDIRECTS TO POSTS WHEN USER ALREADY HAS SUBSCRIPTION", () => {
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();
    
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "johndoe@johndoe.com",
          image: "https://avatars.githubusercontent.com/u/64497059?v=4",
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
  });
});
