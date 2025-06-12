
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCookies, CookieConsent as CookieConsentType } from '@/hooks/useCookies';
import { useLanguage } from '@/hooks/useLanguage';
import { Settings, Cookie, Shield, BarChart3, Target, Wrench } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CookieConsent = () => {
  const { showBanner, acceptAll, acceptEssential, saveConsent } = useCookies();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState<CookieConsentType>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  if (!showBanner) return null;

  const handleCustomConsentChange = (category: keyof CookieConsentType, checked: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCustomConsent(prev => ({
      ...prev,
      [category]: checked,
    }));
  };

  const handleSaveCustom = () => {
    saveConsent(customConsent);
    setShowDetails(false);
  };

  const cookieCategories = [
    {
      key: 'essential' as const,
      icon: Shield,
      title: t?.cookies?.categories?.essential?.title || 'Essential',
      description: t?.cookies?.categories?.essential?.description || 'Necessary for basic website functionality',
      required: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: t?.cookies?.categories?.analytics?.title || 'Analytics',
      description: t?.cookies?.categories?.analytics?.description || 'Help us understand how visitors interact with our website',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: t?.cookies?.categories?.marketing?.title || 'Marketing',
      description: t?.cookies?.categories?.marketing?.description || 'Used to show relevant ads and measure campaign effectiveness',
      required: false,
    },
    {
      key: 'functional' as const,
      icon: Wrench,
      title: t?.cookies?.categories?.functional?.title || 'Functional',
      description: t?.cookies?.categories?.functional?.description || 'Enhance website functionality and personalization',
      required: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/20 to-transparent">
      <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Cookie className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t?.cookies?.banner?.title || 'We respect your privacy'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t?.cookies?.banner?.description || 'We use cookies to enhance your experience, provide social media features, and analyze our traffic. You can choose which cookies to accept.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={acceptAll}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {t?.cookies?.banner?.acceptAll || 'Accept All'}
                </Button>
                
                <Button
                  onClick={acceptEssential}
                  variant="outline"
                  className="border-gray-300"
                >
                  {t?.cookies?.banner?.essentialOnly || 'Essential Only'}
                </Button>

                <Dialog open={showDetails} onOpenChange={setShowDetails}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      <Settings className="w-4 h-4 mr-2" />
                      {t?.cookies?.banner?.customize || 'Customize'}
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-primary" />
                        {t?.cookies?.preferences?.title || 'Cookie Settings'}
                      </DialogTitle>
                      <DialogDescription>
                        {t?.cookies?.preferences?.description || 'Choose which types of cookies you want to allow. You can change these preferences at any time.'}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {cookieCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <div key={category.key} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <IconComponent className="w-4 h-4 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{category.title}</h4>
                                    {category.required && (
                                      <span className="text-xs text-gray-500">
                                        ({t?.cookies?.categories?.essential?.required || 'Required'})
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={category.key}
                                      checked={customConsent[category.key]}
                                      onCheckedChange={(checked) => 
                                        handleCustomConsentChange(category.key, checked as boolean)
                                      }
                                      disabled={category.required}
                                    />
                                    <Label htmlFor={category.key} className="sr-only">
                                      {category.title}
                                    </Label>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={handleSaveCustom} className="flex-1">
                        {t?.cookies?.preferences?.saveCustom || 'Save Preferences'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDetails(false)}
                        className="flex-1"
                      >
                        {t?.cookies?.preferences?.cancel || 'Cancel'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
