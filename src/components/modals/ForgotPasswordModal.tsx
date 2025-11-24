import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordModal = ({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'sent'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStep('sent');
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'email' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Reset Password</span>
              </DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you a link to reset your
                password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="volunteer@idatis.org"
                  required
                  className="transition-smooth focus:shadow-soft"
                />
              </div>

              <DialogFooter className="flex-col space-y-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary-foreground" />
              </div>
              <DialogTitle>Check Your Email</DialogTitle>
              <DialogDescription className="text-center">
                We've sent password reset instructions to{' '}
                <strong>{email}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-center text-sm text-muted-foreground">
              <p>
                Didn't receive the email? Check your spam folder or try a
                different email address.
              </p>
              <p>The reset link will expire in 1 hour for security reasons.</p>
            </div>

            <DialogFooter className="flex-col space-y-2">
              <Button
                onClick={() => setStep('email')}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Different Email
              </Button>
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-primary"
              >
                Back to Login
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
