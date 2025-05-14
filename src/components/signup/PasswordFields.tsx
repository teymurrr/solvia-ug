
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';
import { useLanguage } from '@/hooks/useLanguage';

interface PasswordFieldsProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field}
                  className="pl-10"
                />
              </FormControl>
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </button>
            </div>
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
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field}
                  className="pl-10"
                />
              </FormControl>
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
