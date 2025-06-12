
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCookies, CookieConsent as CookieConsentType } from '@/hooks/useCookies';
import { useLanguage } from '@/hooks/useLanguage';
import { Cookie, Shield, BarChart3, Target, Wrench, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const CookiePreferences = () => {
  const { preferences, saveConsent, resetConsent } = useCookies();
  const { t } = useLanguage();
  const [localConsent, setLocalConsent] = useState<CookieConsentType>(
    preferences?.consent || {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
  );

  const handleConsentChange = (category: keyof CookieConsentType, checked: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setLocalConsent(prev => ({
      ...prev,
      [category]: checked,
    }));
  };

  const handleSave = () => {
    saveConsent(localConsent);
    toast.success(t?.cookies?.toast?.preferencesSaved || 'Cookie preferences saved');
  };

  const handleReset = () => {
    resetConsent();
    toast.success(t?.cookies?.toast?.preferencesReset || 'Cookie preferences reset');
  };

  const cookieCategories = [
    {
      key: 'essential' as const,
      icon: Shield,
      title: t?.cookies?.categories?.essential?.title || 'Essential Cookies',
      description: t?.cookies?.categories?.essential?.description || 'These cookies are necessary for basic website functionality and cannot be disabled.',
      examples: t?.cookies?.categories?.essential?.examples || 'Authentication, security settings, language preferences',
      required: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: t?.cookies?.categories?.analytics?.title || 'Analytics Cookies',
      description: t?.cookies?.categories?.analytics?.description || 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: t?.cookies?.categories?.analytics?.examples || 'Google Analytics, page view counts, time on site',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: t?.cookies?.categories?.marketing?.title || 'Marketing Cookies',
      description: t?.cookies?.categories?.marketing?.description || 'Used to make advertising messages more relevant to you and measure the effectiveness of advertising campaigns.',
      examples: t?.cookies?.categories?.marketing?.examples || 'Facebook Pixel, Google Ads, conversion tracking',
      required: false,
    },
    {
      key: 'functional' as const,
      icon: Wrench,
      title: t?.cookies?.categories?.functional?.title || 'Functional Cookies',
      description: t?.cookies?.categories?.functional?.description || 'Enable the website to provide enhanced functionality and personalization, such as remembering your choices.',
      examples: t?.cookies?.categories?.functional?.examples || 'Theme preferences, sidebar state, user settings',
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary" />
            {t?.cookies?.preferences?.title || 'Cookie Settings'}
          </CardTitle>
          <CardDescription>
            {t?.cookies?.preferences?.description || 'Manage your cookie preferences and control what data we collect.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {preferences && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">
                  {t?.cookies?.preferences?.currentStatus || 'Current Status'}
                </h4>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {t?.cookies?.preferences?.configured || 'Configured'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {t?.cookies?.preferences?.consentGiven || 'Consent given on:'} {new Date(preferences.consentDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.key} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{category.title}</h4>
                            {category.required && (
                              <Badge variant="secondary" className="text-xs">
                                {t?.cookies?.categories?.essential?.required || 'Required'}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {category.description}
                          </p>
                          
                          <div className="text-xs text-gray-500">
                            <strong>
                              {t?.currentLanguage === 'es' ? 'Ejemplos: ' : 'Examples: '}
                            </strong>
                            {category.examples}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={category.key}
                          checked={localConsent[category.key]}
                          onCheckedChange={(checked) => 
                            handleConsentChange(category.key, checked as boolean)
                          }
                          disabled={category.required}
                        />
                        <Label htmlFor={category.key} className="sr-only">
                          {category.title}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              {t?.cookies?.preferences?.savePreferences || 'Save Preferences'}
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {t?.cookies?.preferences?.reset || 'Reset'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePreferences;
