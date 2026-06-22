import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SignatureCanvas from 'react-native-signature-canvas';
import { colors } from '../theme/colors';
import { useLanguage } from '../contexts/LanguageContext';

export default function SignaturePadModal({ visible, onClose, onSave }) {
  const ref = useRef(null);
  const { t } = useLanguage();
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleOK = (signature) => {
    if (!signature) {
      Alert.alert(t('signature.emptyTitle'), t('signature.emptyMsg'));
      return;
    }
    onSave(signature);
    onClose();
  };

  const handleEmpty = () => {
    Alert.alert(t('signature.emptyTitle'), t('signature.emptyMsg'));
  };

  const handleClear = () => {
    setHasDrawn(false);
  };

  const handleEnd = () => {
    setHasDrawn(true);
  };

  const webStyle = `
    .m-signature-pad { box-shadow: none; border: none; }
    .m-signature-pad--body { border: 1px dashed #94a3b8; border-radius: 12px; }
    .m-signature-pad--footer { display: none; }
    body, html { width: 100%; height: 100%; background: #fff; }
  `;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('signature.title')}</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="close" size={26} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.hint}>{t('signature.hint')}</Text>
        <View style={styles.canvasWrap}>
          <SignatureCanvas
            ref={ref}
            onOK={handleOK}
            onEmpty={handleEmpty}
            onEnd={handleEnd}
            onClear={handleClear}
            descriptionText=""
            webStyle={webStyle}
            backgroundColor="#fff"
            penColor="#000"
            imageType="image/png"
          />
        </View>
        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.clearBtn]}
            onPress={() => { ref.current?.clearSignature(); setHasDrawn(false); }}
          >
            <MaterialIcons name="delete" size={18} color={colors.danger} />
            <Text style={[styles.btnText, { color: colors.danger }]}>{t('signature.clear')}</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.saveBtn, !hasDrawn && { opacity: 0.5 }]}
            onPress={() => ref.current?.readSignature()}
            disabled={!hasDrawn}
          >
            <MaterialIcons name="check" size={18} color="#fff" />
            <Text style={[styles.btnText, { color: '#fff' }]}>{t('signature.confirm')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, fontSize: 13, marginBottom: 12, textAlign: 'right' },
  canvasWrap: { flex: 1, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: 12, paddingVertical: 13,
  },
  clearBtn: { backgroundColor: colors.danger + '22', borderWidth: 1, borderColor: colors.danger + '66' },
  saveBtn: { backgroundColor: colors.primaryBright },
  btnText: { fontWeight: '800', fontSize: 14 },
});
