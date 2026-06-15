import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, ActivityIndicator } from 'react-native';
import { ExternalLink, X, AlertCircle } from 'lucide-react-native';
import { colors } from '../../../theme/theme';
import { getSignedUrl } from '../../../services/storage';

export default function DocumentoViewer({ visible, path, tipo, onClose }) {
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!visible || !path) return;
    setLoading(true);
    setError(false);
    setSignedUrl(null);
    getSignedUrl(path)
      .then(setSignedUrl)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [visible, path]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 56,
            right: 20,
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.bgElevated,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color={colors.accent} />
        )}

        {error && (
          <View style={{ alignItems: 'center', gap: 12, padding: 32 }}>
            <AlertCircle size={40} color={colors.danger} />
            <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
              No se pudo cargar el archivo
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
              Verificá tu conexión e intentá de nuevo
            </Text>
          </View>
        )}

        {!loading && !error && signedUrl && tipo === 'imagen' && (
          <Image
            source={{ uri: signedUrl }}
            style={{ width: '95%', height: '80%', borderRadius: 12 }}
            resizeMode="contain"
          />
        )}

        {!loading && !error && signedUrl && tipo === 'pdf' && (
          <View style={{ alignItems: 'center', gap: 16, padding: 32 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
              Archivo PDF
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              Tocá el botón para abrirlo en tu navegador
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(signedUrl)}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ExternalLink size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Abrir PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
