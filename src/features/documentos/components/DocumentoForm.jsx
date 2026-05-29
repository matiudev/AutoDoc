import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FileText, Image as ImageIcon, Calendar } from 'lucide-react-native';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { TIPOS_DOCUMENTO } from '../../../constants/categorias';
import { colors } from '../../../theme/theme';

export default function DocumentoForm({ initialValues = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    nombre: initialValues.nombre ?? '',
    tipo: initialValues.tipo ?? 'otro',
    notas: initialValues.notas ?? '',
    fecha_emision: initialValues.fecha_emision ?? null,
    fecha_vencimiento: initialValues.fecha_vencimiento ?? null,
  });
  const [archivo, setArchivo] = useState(null);
  const [showEmision, setShowEmision] = useState(false);
  const [showVencimiento, setShowVencimiento] = useState(false);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      if (asset.size > 10 * 1024 * 1024) {
        Alert.alert('Archivo muy grande', 'El límite es 10 MB');
        return;
      }
      setArchivo({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setArchivo({ uri: asset.uri, name: `foto_${Date.now()}.jpg`, mimeType: 'image/jpeg' });
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar';

  const handleSubmit = () => {
    onSubmit({ form, archivo });
  };

  const isValid = form.nombre && form.tipo && (archivo || initialValues.archivo_url);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Input
        label="Nombre del documento"
        value={form.nombre}
        onChangeText={(v) => set('nombre', v)}
        placeholder="Seguro del auto"
        style={{ marginBottom: 14 }}
      />

      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        Tipo
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {TIPOS_DOCUMENTO.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => set('tipo', t.value)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: form.tipo === t.value ? `${colors.accent}25` : colors.bgElevated,
              borderWidth: 1,
              borderColor: form.tipo === t.value ? colors.accent : colors.borderDefault,
            }}
          >
            <Text style={{ color: form.tipo === t.value ? colors.accentSoft : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => setShowEmision(true)}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Calendar size={15} color={colors.textSecondary} />
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Emisión</Text>
            <Text style={{ color: form.fecha_emision ? colors.textPrimary : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {formatDate(form.fecha_emision)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowVencimiento(true)}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Calendar size={15} color={colors.textSecondary} />
          <View>
            <Text style={{ color: colors.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Vencimiento</Text>
            <Text style={{ color: form.fecha_vencimiento ? colors.textPrimary : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {formatDate(form.fecha_vencimiento)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showEmision && (
        <DateTimePicker
          value={form.fecha_emision ? new Date(form.fecha_emision) : new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => { setShowEmision(false); if (d) set('fecha_emision', d.toISOString().split('T')[0]); }}
        />
      )}
      {showVencimiento && (
        <DateTimePicker
          value={form.fecha_vencimiento ? new Date(form.fecha_vencimiento) : new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => { setShowVencimiento(false); if (d) set('fecha_vencimiento', d.toISOString().split('T')[0]); }}
        />
      )}

      <Input
        label="Notas (opcional)"
        value={form.notas}
        onChangeText={(v) => set('notas', v)}
        placeholder="Observaciones..."
        multiline
        style={{ marginBottom: 16 }}
      />

      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        Archivo {archivo ? `— ${archivo.name}` : ''}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={pickDocument}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14, alignItems: 'center', gap: 6 }}
        >
          <FileText size={22} color={colors.accentSoft} />
          <Text style={{ color: colors.accentSoft, fontSize: 13, fontWeight: '500' }}>PDF / Archivo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14, alignItems: 'center', gap: 6 }}
        >
          <ImageIcon size={22} color={colors.accentSoft} />
          <Text style={{ color: colors.accentSoft, fontSize: 13, fontWeight: '500' }}>Cámara</Text>
        </TouchableOpacity>
      </View>

      {archivo && (
        <View style={{ backgroundColor: `${colors.success}15`, borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: `${colors.success}30` }}>
          <Text style={{ color: colors.success, fontSize: 13 }}>✓ {archivo.name}</Text>
        </View>
      )}

      <Button label="Guardar documento" onPress={handleSubmit} loading={loading} disabled={!isValid} />
    </ScrollView>
  );
}
