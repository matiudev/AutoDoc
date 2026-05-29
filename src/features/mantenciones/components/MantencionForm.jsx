import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import IconLucide from '../../../components/IconLucide';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { CATEGORIAS_PREDEFINIDAS } from '../../../constants/categorias';
import { colors } from '../../../theme/theme';

export default function MantencionForm({ initialValues = {}, vehiculoKm = 0, categorias = [], onSubmit, loading }) {
  const todasCategorias = [...CATEGORIAS_PREDEFINIDAS, ...categorias.filter((c) => !c.es_predefinida)];

  const [form, setForm] = useState({
    categoria_id: initialValues.categoria_id ?? '',
    descripcion: initialValues.descripcion ?? '',
    fecha_realizada: initialValues.fecha_realizada ?? new Date().toISOString().split('T')[0],
    km_al_realizar: initialValues.km_al_realizar?.toString() ?? vehiculoKm.toString(),
    costo: initialValues.costo?.toString() ?? '',
    taller: initialValues.taller ?? '',
    notas: initialValues.notas ?? '',
    proxima_fecha: initialValues.proxima_fecha ?? null,
    proximos_km: initialValues.proximos_km?.toString() ?? '',
  });
  const [showFechaRealizada, setShowFechaRealizada] = useState(false);
  const [showProximaFecha, setShowProximaFecha] = useState(false);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const catSeleccionada = todasCategorias.find((c) => c.id === form.categoria_id);

  const handleCategoriaSelect = (cat) => {
    const proxKm = cat.intervalo_km
      ? (parseInt(form.km_al_realizar) || vehiculoKm) + cat.intervalo_km
      : null;
    const proxFecha = cat.intervalo_dias
      ? (() => {
          const d = new Date(form.fecha_realizada || new Date());
          d.setDate(d.getDate() + cat.intervalo_dias);
          return d.toISOString().split('T')[0];
        })()
      : null;

    setForm((p) => ({
      ...p,
      categoria_id: cat.id,
      proximos_km: proxKm?.toString() ?? '',
      proxima_fecha: proxFecha,
    }));
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar';

  const handleSubmit = () => {
    onSubmit({
      categoria_id: form.categoria_id,
      descripcion: form.descripcion || null,
      fecha_realizada: form.fecha_realizada,
      km_al_realizar: parseInt(form.km_al_realizar) || 0,
      costo: form.costo ? parseFloat(form.costo) : null,
      taller: form.taller || null,
      notas: form.notas || null,
      proxima_fecha: form.proxima_fecha || null,
      proximos_km: form.proximos_km ? parseInt(form.proximos_km) : null,
    });
  };

  const isValid = form.categoria_id && form.fecha_realizada;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        Categoría
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {todasCategorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => handleCategoriaSelect(cat)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: form.categoria_id === cat.id ? `${colors.accent}25` : colors.bgElevated,
              borderWidth: 1,
              borderColor: form.categoria_id === cat.id ? colors.accent : colors.borderDefault,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <IconLucide name={cat.lucide_icon} size={14} color={form.categoria_id === cat.id ? colors.accentSoft : colors.textSecondary} />
            <Text style={{ color: form.categoria_id === cat.id ? colors.accentSoft : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {cat.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => setShowFechaRealizada(true)}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14 }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Fecha realizada</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>{formatDate(form.fecha_realizada)}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Input label="Km al realizar" value={form.km_al_realizar} onChangeText={(v) => set('km_al_realizar', v)} keyboardType="numeric" placeholder="80000" />
        </View>
      </View>

      {showFechaRealizada && (
        <DateTimePicker
          value={new Date(form.fecha_realizada)}
          mode="date"
          display="default"
          onChange={(_, d) => { setShowFechaRealizada(false); if (d) set('fecha_realizada', d.toISOString().split('T')[0]); }}
        />
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <Input label="Costo (opcional)" value={form.costo} onChangeText={(v) => set('costo', v)} keyboardType="decimal-pad" placeholder="$ 50.000" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Taller (opcional)" value={form.taller} onChangeText={(v) => set('taller', v)} placeholder="Taller Pérez" />
        </View>
      </View>

      <Input label="Notas (opcional)" value={form.notas} onChangeText={(v) => set('notas', v)} placeholder="Observaciones..." multiline style={{ marginBottom: 16 }} />

      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '500', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        Próxima mantención
      </Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => setShowProximaFecha(true)}
          style={{ flex: 1, backgroundColor: colors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: colors.borderDefault, padding: 14 }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Por fecha</Text>
          <Text style={{ color: form.proxima_fecha ? colors.accentSoft : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
            {form.proxima_fecha ? formatDate(form.proxima_fecha) : 'Seleccionar'}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Input label="Por kilometraje" value={form.proximos_km} onChangeText={(v) => set('proximos_km', v)} keyboardType="numeric" placeholder="85000" />
        </View>
      </View>

      {showProximaFecha && (
        <DateTimePicker
          value={form.proxima_fecha ? new Date(form.proxima_fecha) : new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => { setShowProximaFecha(false); if (d) set('proxima_fecha', d.toISOString().split('T')[0]); }}
        />
      )}

      <Button label="Guardar mantención" onPress={handleSubmit} loading={loading} disabled={!isValid} />
    </ScrollView>
  );
}
