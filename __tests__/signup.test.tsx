import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "../pages/signup";
import { toast } from "sonner";
import { startStripeSession } from "../lib/stripe/startSession";
// import { startStripeSession } from "../lib/stripe"; // あなたの実装に合わせて

// jest.mock("react-hot-toast");
// jest.mock("../lib/stripe", () => ({
//   startStripeSession: jest.fn(),
// }));
// unit test
// validation check
// input field check
// error message check
// check api call

// component test

// integration test
const pushMock = jest.fn();
let mockQuery: Record<string, any> = { plan: "trial" };
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    back: jest.fn(),
    pathname: "/signup",
    query: mockQuery, // planパラメータがここに入る
  }),
}));

// __mocks__/toast.ts
jest.mock("sonner", () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../lib/stripe/startSession", () => ({
  startStripeSession: jest.fn(),
}));

describe("Render Signup component", () => {
  beforeEach(() => {
    // mockQuery = { plan: "premium" };
    // render(<Signup />);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Success" }),
      })
    ) as jest.Mock;
  });

  test("Can input email", () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  // calls api when form is valid
  test("calls API when form is valid", async () => {
    // render(<Signup />);
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "aaa@yahoo.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });

    const submitButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(submitButton);
    // fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/signup",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            username: "testuser",
            password: "Password1!",
            email: "aaa@yahoo.com",
            plan: "trial",
          }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });

  test("displays error when email is empty", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  test("Displays error when email is invalid", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(emailInput, { target: { value: "aaa@com" } });
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(
      await screen.findByText("Invalid email address")
    ).toBeInTheDocument();
  });

  test("Displays error when password is empty", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  test("Displays error when password has no uppercase letter", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "password1!" } }); // 小文字のみ
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(
      await screen.findByText(
        "Password must contain at least one uppercase letter"
      )
    ).toBeInTheDocument();
  });

  test("Displays error when password has no number", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "Password!" } }); // 数字なし
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(
      await screen.findByText("Password must contain at least one number")
    ).toBeInTheDocument();
  });

  test("Displays error when password has no special character", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    fireEvent.change(passwordInput, { target: { value: "Password1" } }); // 特殊文字なし
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(
      await screen.findByText(
        "Password must contain at least one special character"
      )
    ).toBeInTheDocument();
  });

  test("Displays error when username is empty", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
  });

  test("Displays error when username is too short", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const usernameInput = screen.getByPlaceholderText("Username");
    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(
      await screen.findByText("Username must be at least 3 characters")
    ).toBeInTheDocument();
  });

  test("Calls API and shows success toast, then redirect to /chat if plan=trial", async () => {
    mockQuery = { plan: "trial" };
    render(<Signup />);
    const successMock = toast.success as jest.Mock;

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(successMock).toHaveBeenCalledWith("Successfully signed up!", {
        position: "top-center",
      });
      expect(pushMock).toHaveBeenCalledWith("/chat");
    });
  });

  // if plan trial

  // if plan premium
  test("If premium plan selected redirect to /payment after signup", async () => {
    mockQuery = { plan: "premium" };
    render(<Signup />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "you@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "Username" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => {
      expect(startStripeSession).toHaveBeenCalledTimes(1);
    });
  });

  // no plan

  // API Fail

  // double click

  // error but still keeping the data

  //
});

// . 単体テスト（Unit Tests）

// フォームバリデーションのテスト
// 入力フィールドの必須チェック
// エラーメッセージの表示確認
// フォーム送信時のデータ構造確認

// 2. コンポーネントテスト（Component Tests）

// レンダリングテスト（正しく表示されるか）
// ユーザーインタラクションテスト（入力、クリック）
// 各状態でのUI変化テスト
// プロップスの受け渡しテスト

// 3. 統合テスト（Integration Tests）

// APIエンドポイント（/api/auth/signup）との連携
// 成功時の画面遷移テスト
// エラー時のトースト表示テスト
// Stripeセッション開始の動作確認

// 4. E2Eテスト（End-to-End Tests）

// 実際のユーザーフローの再現
// ブラウザでの動作確認
// 異なるプランでの分岐テスト
// エラーケースの実際の動作確認

// 5. アクセシビリティテスト

// スクリーンリーダー対応
// キーボードナビゲーション
// フォーカス管理
// ARIA属性の適切性
