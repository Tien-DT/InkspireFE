import { Component } from "react";
import type { ReactNode } from "react";
import axios, { isAxiosError } from "axios";
import { Button } from "~/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { clearAllAuth } from "~/utils/auth";

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface AuthErrorBoundaryProps {
  children: ReactNode;
  /**
   * UI rơi vào khi có lỗi (nếu không truyền sẽ render fallback mặc định)
   */
  fallback?: ReactNode;
  /**
   * Callback khi có lỗi (log Sentry, v.v.)
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Tự redirect về /login khi gặp lỗi auth
   */
  autoRedirectToLogin?: boolean;
  /**
   * URL trang login
   */
  loginPath?: string;
}

export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  static defaultProps = {
    autoRedirectToLogin: false,
    loginPath: "/login",
  };

  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    this.props.onError?.(error, errorInfo);

    if (this.isAuthError(error)) {
      this.handleAuthError();
    }
  }

  private isAuthError(error: unknown): boolean {
    // Ưu tiên nhận diện AxiosError có status 401/403
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) return true;
    }

    // Fallback nhận diện theo message
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      const patterns = ["unauthorized", "token expired", "invalid token", "authentication failed", "401", "403"];
      return patterns.some((p) => msg.includes(p));
    }
    return false;
  }

  private handleAuthError = () => {
    clearAllAuth();
    if (this.props.autoRedirectToLogin) {
      const from = window.location.pathname + window.location.search;
      const url = new URL(this.props.loginPath!, window.location.origin);
      url.searchParams.set("from", from);
      window.location.replace(url.toString());
    }
  };

  private handleRetry = () => {
    // remount “nhẹ”: xoá state lỗi → render lại children
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleHardReload = () => {
    window.location.reload();
  };

  private handleLogout = () => {
    clearAllAuth();
    const from = window.location.pathname + window.location.search;
    const url = new URL(this.props.loginPath!, window.location.origin);
    url.searchParams.set("from", from);
    window.location.replace(url.toString());
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">Đã xảy ra lỗi xác thực</h2>
            <p className="text-gray-600 mb-6">
              Phiên đăng nhập có thể đã hết hạn hoặc có lỗi xác thực. Vui lòng thử lại hoặc đăng nhập lại.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Chi tiết lỗi (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
{this.state.error.message}
{this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={this.handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
              <Button onClick={this.handleHardReload} className="flex items-center gap-2">
                Tải lại trang
              </Button>
              <Button onClick={this.handleLogout} className="flex items-center gap-2">
                Đăng nhập lại
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;

