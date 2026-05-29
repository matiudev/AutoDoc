import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, Pressable } from 'react-native';
import { ExternalLink, X } from 'lucide-react-native';
import { colors } from '../../../theme/theme';

export default function DocumentoViewer({ visible, url, tipo, onClose }) {
  if (!visible || !url) return null;

  const isImage = tipo === 'imagen';

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

        {isImage ? (
          <Image
            source={{ uri: url }}
            style={{ width: '95%', height: '80%', borderRadius: 12 }}
            resizeMode="contain"
          />
        ) : (
          <View style={{ alignItems: 'center', gap: 16, padding: 32 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
              Visualización de PDF
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>
              Tocá el botón para abrir el archivo en tu navegador
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(url)}
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
