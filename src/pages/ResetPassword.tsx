import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Security utilities
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"'&]/g, '');
};

// Zod password schema with comprehensive validation rules
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be no more than 128 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/,
    'Password must contain at least one special character'
  );

// Returns an array of user-friendly validation error messages
const validatePassword = (password: string): string[] => {
  const result = passwordSchema.safeParse(password);
  if (result.success) return [];

  // Extract unique error messages from Zod validation result
  const messages = result.error.errors.map((error) => error.message);
  return Array.from(new Set(messages));
};

const validateToken = (token: string): boolean => {
  // Basic token validation - should be a hex string of reasonable length
  const hexPattern = /^[a-f0-9]{64}$/i;
  return hexPattern.test(token) && token.length === 64;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [serverErrorCode, setServerErrorCode] = useState<string | null>(null);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null
  );

  // Rate limiting - max 5 attempts per session
  const MAX_ATTEMPTS = 5;
  const RATE_LIMIT_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    const urlToken = searchParams.get('token');

    if (!urlToken) {
      toast({
        title: 'Invalid Link',
        description:
          'No reset token provided. Please use the link from your email.',
        variant: 'destructive',
      });
      navigate('/login', { replace: true });
      return;
    }

    const cleanToken = sanitizeInput(urlToken);

    if (!validateToken(cleanToken)) {
      toast({
        title: 'Invalid Token',
        description: 'The reset token is invalid or malformed.',
        variant: 'destructive',
      });
      navigate('/login', { replace: true });
      return;
    }

    setToken(cleanToken);
    setIsTokenValid(true);
  }, [searchParams, navigate, toast]);

  useEffect(() => {
    if (password) {
      setValidationErrors(validatePassword(password));
    }
  }, [password]);

  useEffect(() => {
    // Check for rate limiting in localStorage
    const rateLimitData = localStorage.getItem('reset-password-attempts');
    if (rateLimitData) {
      const { count, timestamp } = JSON.parse(rateLimitData);
      const now = Date.now();

      if (now - timestamp < RATE_LIMIT_TIMEOUT && count >= MAX_ATTEMPTS) {
        setIsRateLimited(true);
        setTimeout(
          () => setIsRateLimited(false),
          RATE_LIMIT_TIMEOUT - (now - timestamp)
        );
      } else if (now - timestamp >= RATE_LIMIT_TIMEOUT) {
        localStorage.removeItem('reset-password-attempts');
        setAttemptCount(0);
      } else {
        setAttemptCount(count);
      }
    }
  }, [RATE_LIMIT_TIMEOUT, MAX_ATTEMPTS]);

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      // Clear rate limiting data on success
      localStorage.removeItem('reset-password-attempts');

      toast({
        title: 'Password Reset Successfully',
        description:
          'Your password has been updated. You can now log in with your new password.',
        variant: 'default',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    },
    onError: (error: unknown) => {
      // Track failed attempts
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      const rateLimitData = {
        count: newAttemptCount,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        'reset-password-attempts',
        JSON.stringify(rateLimitData)
      );

      if (newAttemptCount >= MAX_ATTEMPTS) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), RATE_LIMIT_TIMEOUT);
      }

      // Default generic message (don't leak internal details)
      let errorMessage = 'An error occurred while resetting your password.';
      let code: string | undefined;

      if (error && typeof error === 'object') {
        const err = error as {
          response?: {
            data?: { message?: string; error?: string; code?: string };
          };
          message?: string;
        };

        // Prefer explicit API payload fields: error or message
        errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          errorMessage;

        code = err.response?.data?.code;
      }

      // Store server-provided code/message in state so UI can react accordingly
      setServerErrorCode(code ?? null);
      setServerErrorMessage(errorMessage);

      // Show a concise toast for immediate feedback
      toast({
        title: 'Reset Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRateLimited) {
      toast({
        title: 'Too Many Attempts',
        description:
          'You have exceeded the maximum number of attempts. Please wait 15 minutes before trying again.',
        variant: 'destructive',
      });
      return;
    }

    if (!isTokenValid || !token) {
      toast({
        title: 'Invalid Token',
        description: 'The reset token is invalid or has expired.',
        variant: 'destructive',
      });
      return;
    }

    const cleanPassword = password.trim();

    if (validationErrors.length > 0) {
      toast({
        title: 'Invalid Password',
        description:
          'Please fix the password validation errors before continuing.',
        variant: 'destructive',
      });
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      toast({
        title: "Passwords Don't Match",
        description: 'Please ensure both password fields match.',
        variant: 'destructive',
      });
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: cleanPassword,
    });
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's strong and secure.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {resetPasswordMutation.isSuccess && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Password reset successful! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {isRateLimited && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Too many failed attempts. Please wait 15 minutes before trying
                again.
              </AlertDescription>
            </Alert>
          )}

          {serverErrorMessage && (
            <Alert
              variant={serverErrorCode ? 'destructive' : undefined}
              className="mb-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverErrorMessage}</AlertDescription>
              {/* Action for specific backend codes */}
              {(serverErrorCode === 'INVALID_TOKEN' ||
                serverErrorCode === 'TOKEN_ALREADY_USED' ||
                serverErrorCode === 'TOKEN_EXPIRED') && (
                <div className="mt-3 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Guide the user to request a new reset link from the login/forgot flow
                      navigate('/login');
                      // Small toast to explain next step
                      toast({
                        title: 'Request a new reset link',
                        description:
                          'Use the "Forgot Password" option on the login page to request a new reset link.',
                      });
                    }}
                  >
                    Request new reset
                  </Button>
                </div>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="pr-10"
                  disabled={resetPasswordMutation.isPending || isRateLimited}
                  maxLength={128}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={resetPasswordMutation.isPending || isRateLimited}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {validationErrors.length > 0 && (
                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="pr-10"
                  disabled={resetPasswordMutation.isPending || isRateLimited}
                  maxLength={128}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={resetPasswordMutation.isPending || isRateLimited}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                resetPasswordMutation.isPending ||
                isRateLimited ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                validationErrors.length > 0
              }
            >
              {resetPasswordMutation.isPending
                ? 'Resetting Password...'
                : 'Reset Password'}
            </Button>

            {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                {MAX_ATTEMPTS - attemptCount} attempts remaining
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              disabled={resetPasswordMutation.isPending}
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
