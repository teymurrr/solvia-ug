
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useMyMentorProfile, useUpsertMentorProfile, EXPERTISE_OPTIONS } from '@/hooks/useMentors';
import { useLanguage } from '@/hooks/useLanguage';

const LANGUAGE_OPTIONS = ['English', 'German', 'Spanish', 'French', 'Russian', 'Arabic', 'Portuguese', 'Turkish'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BecomeMentorDialog = ({ open, onOpenChange }: Props) => {
  const { data: existing } = useMyMentorProfile();
  const upsert = useUpsertMentorProfile();
  const { t } = useLanguage();
  const mt = (t as any)?.community?.mentor;

  const expertiseLabels: Record<string, string> = mt?.expertiseLabels || {
    'homologation': 'Homologation',
    'fsp-preparation': 'FSP Preparation',
    'german-language': 'German Language',
    'job-search': 'Job Search',
    'relocation': 'Relocation',
    'visa-process': 'Visa Process',
    'hospital-life': 'Hospital Life',
    'specialty-training': 'Specialty Training',
  };

  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState(0);
  const [languages, setLanguages] = useState<string[]>([]);
  const [availability, setAvailability] = useState('available');
  const [maxMentees, setMaxMentees] = useState(3);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (existing) {
      setBio(existing.bio || '');
      setExpertise(existing.expertise || []);
      setYearsExp(existing.years_experience || 0);
      setLanguages(existing.languages_spoken || []);
      setAvailability(existing.availability || 'available');
      setMaxMentees(existing.max_mentees || 3);
      setIsActive(existing.is_active ?? true);
    }
  }, [existing]);

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleSave = () => {
    upsert.mutate(
      { bio, expertise, years_experience: yearsExp, languages_spoken: languages, availability, max_mentees: maxMentees, is_active: isActive },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existing ? (mt?.editProfile || 'Edit Mentor Profile') : (mt?.createProfile || 'Become a Mentor')}</DialogTitle>
          <DialogDescription>
            {mt?.profileDescription || 'Share your expertise and help fellow professionals on their journey.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{mt?.bio || 'Bio'}</Label>
            <Textarea
              placeholder={mt?.bioPlaceholder || 'Tell mentees about your experience and how you can help...'}
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label>{mt?.expertise || 'Areas of Expertise'}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {EXPERTISE_OPTIONS.map(opt => (
                <Badge
                  key={opt}
                  variant={expertise.includes(opt) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleItem(expertise, opt, setExpertise)}
                >
                  {expertiseLabels[opt] || opt}
                  {expertise.includes(opt) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>{mt?.languagesSpoken || 'Languages Spoken'}</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {LANGUAGE_OPTIONS.map(lang => (
                <Badge
                  key={lang}
                  variant={languages.includes(lang) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleItem(languages, lang, setLanguages)}
                >
                  {lang}
                  {languages.includes(lang) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{mt?.yearsExperience || 'Years of Experience'}</Label>
              <Input type="number" min={0} max={50} value={yearsExp} onChange={e => setYearsExp(Number(e.target.value))} />
            </div>
            <div>
              <Label>{mt?.maxMentees || 'Max Mentees'}</Label>
              <Input type="number" min={1} max={10} value={maxMentees} onChange={e => setMaxMentees(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <Label>{mt?.availability || 'Availability'}</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">{mt?.available || 'Available'}</SelectItem>
                <SelectItem value="limited">{mt?.limited || 'Limited'}</SelectItem>
                <SelectItem value="unavailable">{mt?.unavailable || 'Unavailable'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>{mt?.profileActive || 'Profile Active'}</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{mt?.cancel || 'Cancel'}</Button>
          <Button onClick={handleSave} disabled={upsert.isPending || expertise.length === 0}>
            {upsert.isPending ? (mt?.saving || 'Saving...') : existing ? (mt?.updateProfile || 'Update Profile') : (mt?.createProfile || 'Create Profile')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeMentorDialog;
