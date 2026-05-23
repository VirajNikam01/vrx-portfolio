import { act, render } from "@testing-library/react";

import { SplashScreen } from "@/components/splash/splash-screen";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

jest.mock("@/components/animations/apple-hello-effect", () => ({
  AppleHelloEnglishEffect: ({
    onAnimationComplete,
  }: {
    onAnimationComplete?: () => void;
  }) => (
    <button type="button" onClick={onAnimationComplete}>
      hello
    </button>
  ),
}));

describe("SplashScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("falls back to completing when the animation callback does not fire", () => {
    const onComplete = jest.fn();

    render(<SplashScreen onComplete={onComplete} />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
