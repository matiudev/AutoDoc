import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { colors } from '../../../theme/theme';
import { COLORES_VEHICULO } from '../../../constants/colores';

export default function VehiculoForm({ initialValues = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    nombre_alias: initialValues.nombre_alias ?? '',
    patente: initialValues.patente ?? '',
    marca: initialValues.marca ?? '',
    modelo: initialValues.modelo ?? '',
    anio: initialValues.anio?.toString() ?? '',
    color: initialValues.color ?? '',
    km_actual: initialValues.km_actual?.toString() ?? '',
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    onSubmit({
      nombre_alias: form.nombre_alias.trim(),
      patente: form.patente.trim().toUpperCase(),
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      anio: parseInt(form.anio) || null,
      color: form.color || null,
      km_actual: parseInt(form.km_actual) || 0,
    });
  };

  const isValid = form.nombre_alias && form.patente && form.marca && form.modelo;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Input label="Alias del vehículo" value={form.nombre_alias} onChangeText={(v) => set('nombre_alias', v)} placeholder="Mi Hilux" style={{ marginBottom: 14 }} />
      <Input label="Patente" value={form.patente} onChangeText={(v) => set('patente', v)} placeholder="ABCD12" style={{ marginBottom: 14 }} />

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Input label="Marca" value={form.marca} onChangeText={(v) => set('marca', v)} placeholder="Toyota" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Modelo" value={form.modelo} onChangeText={(v) => set('modelo', v)} placeholder="Hilux" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Input label="Año" value={form.anio} onChangeText={(v) => set('anio', v)} placeholder="2020" keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Kilometraje actual" value={form.km_actual} onChangeText={(v) => set('km_actual', v)} placeholder="80000" keyboardType="numeric" />
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Color
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {COLORES_VEHICULO.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => set('color', c.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 10,
                backgroundColor: form.color === c.value ? `${colors.accent}25` : colors.bgElevated,
                borderWidth: 1,
                borderColor: form.color === c.value ? colors.accent : colors.borderDefault,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.hex, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)' }} />
              <Text style={{ color: form.color === c.value ? colors.accentSoft : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button label="Guardar vehículo" onPress={handleSubmit} loading={loading} disabled={!isValid} />
    </ScrollView>
  );
}
