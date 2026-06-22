import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FEEDBACK_CATEGORIES, sendFeedbackViaWhatsApp } from '../utils/feedback';

export default function FeedbackModal({ visible, onClose }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [category, setCategory] = useState('bug');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const reset = () => {
    setCategory('bug');
    setDescription('');
    setSending(false);
  };

  const onSend = async () => {
    if (!description.trim()) {
      Alert.alert(t('feedback.emptyTitle'), t('feedback.emptyMsg'));
      return;
    }
    setSending(true);
    const ok = await sendFeedbackViaWhatsApp({ category, description, user });
    setSending(false);
    if (ok) {
      reset();
      onClose && onClose();
    }
  };

  const close = () => {
    reset();
    onClose && onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <MaterialIcons name="campaign" size={22} color={colors.primaryBright} />
            <Text style={styles.title}>{t('feedback.title')}</Text>
            <Pressable onPress={close} hitSlop={10} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>{t('feedback.subtitle')}</Text>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>{t('feedback.typeLabel')}</Text>
            <View style={styles.catGrid}>
              {FEEDBACK_CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    style={[styles.catChip, active && styles.catChipActive]}
                  >
                    <Text style={styles.catEmoji}>{c.emoji}</Text>
                    <Text style={[styles.catText, active && styles.catTextActive]}>
                      {t(c.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>{t('feedback.descLabel')}</Text>
            <TextInput
              style={styles.textarea}
              value={description}
              onChangeText={setDescription}
              placeholder={t('feedback.descPlaceholder')}
              placeholderTextColor={colors.textFaint}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={16} color={colors.textMuted} />
              <Text style={styles.infoText}>{t('feedback.privacyNote')}</Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable onPress={close} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>{t('feedback.cancel')}</Text>
            </Pressable>
            <Pressable onPress={onSend} disabled={sending} style={[styles.btn, styles.btnPrimary, sending && { opacity: 0.6 }]}>
              <MaterialIcons name="send" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>{t('feedback.send')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 18,
  },
  card: {
    width: '100%', maxWidth: 460, maxHeight: '85%',
    backgroundColor: colors.card, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.cardBorderActive,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '800' },
  closeBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 4, marginBottom: 12 },
  scroll: { flexGrow: 0 },

  fieldLabel: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 6 },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.cardElevated,
  },
  catChipActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryBright + '22',
  },
  catEmoji: { fontSize: 14 },
  catText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  catTextActive: { color: colors.primaryBright },

  textarea: {
    minHeight: 110,
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: colors.cardElevated, color: colors.text,
    fontSize: 14, textAlign: 'right',
    marginBottom: 10,
  },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    padding: 10, borderRadius: 10,
    backgroundColor: colors.cardElevated + '88',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  infoText: { color: colors.textMuted, fontSize: 11, flex: 1, lineHeight: 16 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  btnGhost: { borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: 'transparent' },
  btnGhostText: { color: colors.textMuted, fontWeight: '700' },
  btnPrimary: { backgroundColor: '#25D366' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
});
