import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react-native';
import useAuthStore from '../store/useAuthStore';
import { resetPassword } from '../services/authService';
import Input from '../../../components/ui/Input';
import { colors } from '../../../theme/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, register, loading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay: 150, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (next) => {
    clearError();
    setLocalError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setMode(next);
  };

  const validate = () => {
    if (!email.trim()) return 'Ingresá tu email';
    if (!password) return 'Ingresá tu contraseña';
    if (mode === 'register') {
      if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    }
    return null;
  };

  const handleSubmit = async () => {
    setLocalError('');
    setSuccessMsg('');
    const validationError = validate();
    if (validationError) { setLocalError(validationError); return; }

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        const data = await register(email.trim(), password);
        if (!data?.session) {
          setSuccessMsg('¡Cuenta creada! Revisá tu email para confirmar tu cuenta.');
          setMode('login');
        }
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setLocalError('Ingresá tu email para recuperar la contraseña'); return; }
    try {
      await resetPassword(email.trim());
      setSuccessMsg('Te enviamos un email para restablecer tu contraseña.');
      setLocalError('');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgBase }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.bgBase} />

      <LinearGradient
        colors={['#7C3AED18', colors.bgBase]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />
      <View style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#7C3AED07', borderWidth: 1, borderColor: '#7C3AED12' }} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 28,
            paddingTop: insets.top + 48,
            paddingBottom: insets.bottom + 32,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 44 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: `${colors.accent}20`,
                borderWidth: 1.5,
                borderColor: `${colors.accent}40`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Car size={40} color={colors.accent} />
            </View>
            <Text style={{ color: colors.textPrimary, fontSize: 36, fontWeight: '800', letterSpacing: -1.2, marginBottom: 6 }}>
              AutoDoc
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
              {mode === 'login' ? 'Iniciá sesión para continuar' : 'Creá tu cuenta gratis'}
            </Text>
          </View>

          {/* Mensajes */}
          {displayError ? (
            <View style={{ backgroundColor: `${colors.danger}18`, borderRadius: 12, padding: 13, marginBottom: 16, borderWidth: 1, borderColor: `${colors.danger}30` }}>
              <Text style={{ color: colors.danger, fontSize: 13, lineHeight: 18 }}>{displayError}</Text>
            </View>
          ) : null}

          {successMsg ? (
            <View style={{ backgroundColor: `${colors.success}18`, borderRadius: 12, padding: 13, marginBottom: 16, borderWidth: 1, borderColor: `${colors.success}30` }}>
              <Text style={{ color: colors.success, fontSize: 13, lineHeight: 18 }}>{successMsg}</Text>
            </View>
          ) : null}

          {/* Formulario */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            style={{ marginBottom: 14 }}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            style={{ marginBottom: mode === 'register' ? 14 : 8 }}
          />

          {mode === 'register' && (
            <Input
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repetí tu contraseña"
              secureTextEntry
              style={{ marginBottom: 8 }}
            />
          )}

          {mode === 'login' && (
            <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
              <Text style={{ color: colors.accentSoft, fontSize: 13, fontWeight: '500' }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          )}

          {mode === 'register' && <View style={{ height: 24 }} />}

          {/* Botón principal */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.82}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: loading ? 0.7 : 1,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 }}>
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </Text>
            {!loading && <ArrowRight size={18} color="#fff" />}
          </TouchableOpacity>

          {/* Toggle login/register */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
            </Text>
            <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              <Text style={{ color: colors.accentSoft, fontSize: 14, fontWeight: '700' }}>
                {mode === 'login' ? 'Registrarte' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
