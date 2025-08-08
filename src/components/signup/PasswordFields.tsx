
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/hooks/useLanguage';

interface PasswordFieldsProps {
  form: UseFormReturn<any>;
}

const calcStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(3, score); // 0-3
};

export const PasswordFields: React.FC<PasswordFieldsProps> = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockPassword, setCapsLockPassword] = useState(false);
  const [capsLockConfirm, setCapsLockConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.password}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setStrength(calcStrength(e.target.value));
                  }}
                  onKeyUp={(e) => setCapsLockPassword((e as any).getModifierState && (e as any).getModifierState('CapsLock'))}
                  className="pl-10"
                  aria-label={t.auth.password}
                />
              </FormControl>
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </button>
            </div>
            {/* Strength meter */}
            <div className="mt-2 h-1.5 bg-muted rounded">
              <div
                className={`h-full rounded transition-all ${
                  strength <= 1 ? 'bg-destructive w-1/3' : strength === 2 ? 'bg-yellow-500 w-2/3' : 'bg-primary w-full'
                }`}
              />
            </div>
            {capsLockPassword && (
              <p className="mt-1 text-xs text-muted-foreground">Caps Lock is on</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.confirmPassword}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  {...field}
                  onKeyUp={(e) => setCapsLockConfirm((e as any).getModifierState && (e as any).getModifierState('CapsLock'))}
                  className="pl-10"
                  aria-label={t.auth.confirmPassword}
                />
              </FormControl>
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </button>
            </div>
            {capsLockConfirm && (
              <p className="mt-1 text-xs text-muted-foreground">Caps Lock is on</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
