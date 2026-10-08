import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, ShieldCheck, ShieldAlert, Lock, Trash2 } from 'lucide-react';
import { Profile } from '../types';

export const ProfileSwitchModal: React.FC = () => {
  const {
    user,
    activeProfile,
    switchProfile,
    addProfile,
    deleteProfile,
    showProfileSwitchModal,
    setShowProfileSwitchModal,
    showToast
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [pinRequiredProfile, setPinRequiredProfile] = useState<Profile | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Selected avatar index
  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  if (!showProfileSwitchModal) return null;

  const handleProfileClick = (profile: Profile) => {
    // If profile has PIN and switching from another profile, require PIN
    if (profile.pin && profile.id !== activeProfile.id) {
      setPinRequiredProfile(profile);
      setEnteredPin('');
      setPinError(false);
      return;
    }
    switchProfile(profile.id);
  };

  const handleVerifyPin = () => {
    if (pinRequiredProfile && enteredPin === (pinRequiredProfile.pin || '1234')) {
      switchProfile(pinRequiredProfile.id);
      setPinRequiredProfile(null);
    } else {
      setPinError(true);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addProfile({
      name: newName.trim(),
      avatarUrl: selectedAvatar,
      isKids,
      language: 'English',
      streamingQuality: 'Auto',
      audioLanguage: 'English',
      subtitleLanguage: 'English [CC]',
      autoplayPreviews: true
    });

    setIsCreating(false);
    setNewName('');
    setIsKids(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-2xl border border-white/10 p-6 shadow-2xl">
        <button
          onClick={() => {
            setShowProfileSwitchModal(false);
            setPinRequiredProfile(null);
            setIsCreating(false);
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PIN VERIFICATION VIEW */}
        {pinRequiredProfile ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Profile PIN Protected</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter PIN for "{pinRequiredProfile.name}" (Default: 1234)
              </p>
            </div>
            <input
              type="password"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-32 text-center tracking-widest text-xl font-mono p-2 rounded-lg bg-zinc-900 border border-white/20 text-white focus:outline-none focus:border-rose-500 mx-auto block"
            />
            {pinError && <p className="text-xs text-rose-500">Incorrect PIN. Try 1234.</p>}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setPinRequiredProfile(null)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPin}
                className="px-5 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : isCreating ? (
          /* CREATE PROFILE FORM */
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <h3 className="text-lg font-bold text-white font-['Syne',sans-serif]">Add New Profile</h3>

            <div>
              <label className="text-xs text-zinc-400 block mb-2">Choose Avatar</label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="avatar option"
                    onClick={() => setSelectedAvatar(img)}
                    className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-transform ${
                      selectedAvatar === img ? 'border-rose-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Profile Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Mia or Family Room"
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Kids Safe Profile
                </span>
                <p className="text-[11px] text-zinc-400">Restricts mature 16+ & 18+ titles automatically</p>
              </div>
              <input
                type="checkbox"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
                className="w-4 h-4 accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg"
              >
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          /* PROFILE SELECTION GRID */
          <div className="text-center">
            <h3 className="text-xl font-black text-white tracking-tight font-['Syne',sans-serif]">
              Who's Watching?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select your profile to continue with customized recommendations
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
              {user.profiles.map((p) => {
                const isActive = p.id === activeProfile.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleProfileClick(p)}
                    className="group relative flex flex-col items-center cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className={`w-20 h-20 rounded-2xl object-cover transition-transform group-hover:scale-105 ${
                          isActive ? 'ring-2 ring-rose-500 shadow-xl' : 'opacity-80 group-hover:opacity-100'
                        }`}
                      />
                      {p.pin && (
                        <div className="absolute top-1 right-1 bg-black/80 p-1 rounded-full text-zinc-300">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                      {p.isKids && (
                        <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                          Kids
                        </span>
                      )}
                    </div>

                    <span className="mt-2 text-xs font-semibold text-zinc-200 group-hover:text-rose-400 truncate max-w-[100px]">
                      {p.name}
                    </span>

                    {user.profiles.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProfile(p.id);
                        }}
                        className="mt-1 text-[10px] text-zinc-500 hover:text-rose-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add Profile Card */}
              {user.profiles.length < 5 && (
                <div
                  onClick={() => setIsCreating(true)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-white/15 hover:border-rose-500 cursor-pointer group transition-colors"
                >
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center group-hover:bg-rose-600/20 text-zinc-400 group-hover:text-rose-400 transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-zinc-400 group-hover:text-white">
                    Add Profile
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
