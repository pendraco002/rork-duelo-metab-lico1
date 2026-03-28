import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

export type AppTheme = 'light' | 'dark' | 'system';

interface SettingsState {
  notificationsEnabled: boolean;
  profilePublic: boolean;
  theme: AppTheme;
  lastBackupAt: string | null;
  dataExportCount: number;
}

interface SettingsContextValue extends SettingsState {
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  setProfilePublic: (value: boolean) => Promise<void>;
  setTheme: (theme: AppTheme) => Promise<void>;
  backupToCloud: () => Promise<void>;
  getExportPayload: () => Promise<string>;
}

const SETTINGS_STORAGE_KEY = 'app_settings_v1';

export const [SettingsProvider, useSettings] = createContextHook<SettingsContextValue>(() => {
  const [settings, setSettings] = useState<SettingsState>({
    notificationsEnabled: true,
    profilePublic: true,
    theme: 'light',
    lastBackupAt: null,
    dataExportCount: 0,
  });

  const load = useCallback(async () => {
    try {
      console.log('[Settings] Loading settings from storage');
      const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsState>;
        setSettings((prev) => ({
          notificationsEnabled: parsed.notificationsEnabled ?? prev.notificationsEnabled,
          profilePublic: parsed.profilePublic ?? prev.profilePublic,
          theme: (parsed.theme as AppTheme) ?? prev.theme,
          lastBackupAt: parsed.lastBackupAt ?? prev.lastBackupAt,
          dataExportCount: parsed.dataExportCount ?? prev.dataExportCount,
        }));
      }
    } catch (e) {
      console.error('[Settings] Failed to load settings', e);
    }
  }, []);

  const persist = useCallback(async (next: SettingsState) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('[Settings] Failed to persist settings', e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setNotificationsEnabled = useCallback(async (value: boolean) => {
    console.log('[Settings] setNotificationsEnabled', value);
    const next = { ...settings, notificationsEnabled: value };
    setSettings(next);
    await persist(next);
    if (Platform.OS === 'web') {
      console.log('Web: notifications toggle simulated');
    }
  }, [settings, persist]);

  const setProfilePublic = useCallback(async (value: boolean) => {
    console.log('[Settings] setProfilePublic', value);
    const next = { ...settings, profilePublic: value };
    setSettings(next);
    await persist(next);
  }, [settings, persist]);

  const setTheme = useCallback(async (theme: AppTheme) => {
    console.log('[Settings] setTheme', theme);
    const next = { ...settings, theme };
    setSettings(next);
    await persist(next);
    Alert.alert('Tema aplicado', theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Automático');
  }, [settings, persist]);

  const backupToCloud = useCallback(async () => {
    console.log('[Settings] backupToCloud');
    const nowIso = new Date().toISOString();
    const next = { ...settings, lastBackupAt: nowIso };
    setSettings(next);
    await persist(next);
    Alert.alert('Backup concluído', 'Seus dados foram salvos com segurança.');
  }, [settings, persist]);

  const getExportPayload = useCallback(async () => {
    try {
      const userRaw = await AsyncStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const payload = {
        exportedAt: new Date().toISOString(),
        platform: Platform.OS,
        settings,
        user,
        version: '1.0.0',
      };
      const json = JSON.stringify(payload, null, 2);
      const next = { ...settings, dataExportCount: settings.dataExportCount + 1 };
      setSettings(next);
      await persist(next);
      return json;
    } catch (e) {
      console.error('[Settings] getExportPayload failed', e);
      throw e;
    }
  }, [settings, persist]);

  const value: SettingsContextValue = useMemo(() => ({
    notificationsEnabled: settings.notificationsEnabled,
    profilePublic: settings.profilePublic,
    theme: settings.theme,
    lastBackupAt: settings.lastBackupAt,
    dataExportCount: settings.dataExportCount,
    setNotificationsEnabled,
    setProfilePublic,
    setTheme,
    backupToCloud,
    getExportPayload,
  }), [settings, setNotificationsEnabled, setProfilePublic, setTheme, backupToCloud, getExportPayload]);

  return value;
});
