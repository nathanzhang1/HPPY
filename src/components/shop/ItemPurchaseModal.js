import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Available animals that can wear items
const ANIMALS = [
  { id: 'platypus', name: 'Platypus', image: require('../../../assets/profile-completion/platypus.png') },
  { id: 'otter', name: 'Otter', image: require('../../../assets/profile-completion/platypus.png') },
  { id: 'beaver', name: 'Beaver', image: require('../../../assets/profile-completion/platypus.png') },
];

export default function ItemPurchaseModal({ 
  visible, 
  onClose, 
  item,
  userCoins,
  onPurchase 
}) {
  const [selectedAnimal, setSelectedAnimal] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (visible) {
      setError('');
      setSuccess(false);
      setSelectedAnimal(0);
    }
  }, [visible]);

  const handlePrevAnimal = () => {
    setSelectedAnimal((prev) => (prev === 0 ? ANIMALS.length - 1 : prev - 1));
  };

  const handleNextAnimal = () => {
    setSelectedAnimal((prev) => (prev === ANIMALS.length - 1 ? 0 : prev + 1));
  };

  const handleBuy = async () => {
    setError('');
    
    if (userCoins < item.price) {
      setError("You don't have enough coins!");
      return;
    }

    setPurchasing(true);
    try {
      await onPurchase(item);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {!success ? (
            <>
              <Text style={styles.title}>{item.name}</Text>

              <View style={styles.previewContainer}>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={handlePrevAnimal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navButtonText}>←</Text>
                </TouchableOpacity>

                <View style={styles.animalContainer}>
                  <Image
                    source={ANIMALS[selectedAnimal].image}
                    style={styles.animalImage}
                    resizeMode="contain"
                  />
                  <Image
                    source={item.image}
                    style={styles.itemPreview}
                    resizeMode="contain"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={handleNextAnimal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navButtonText}>→</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.animalName}>{ANIMALS[selectedAnimal].name}</Text>

              <View style={styles.priceContainer}>
                <Image
                  source={require('../../../assets/home/coin-icon.png')}
                  style={styles.coinIcon}
                  resizeMode="contain"
                />
                <Text style={styles.priceText}>{item.price}</Text>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                  disabled={purchasing}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.button, styles.buyButton]}
                  onPress={handleBuy}
                  activeOpacity={0.8}
                  disabled={purchasing}
                >
                  <Text style={styles.buyButtonText}>
                    {purchasing ? 'Buying...' : 'Buy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Purchase Successful!</Text>
              <Text style={styles.successSubtext}>
                The item has been added to your inventory
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FDF8EF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#75383B',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#75383B',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2DAB3',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#75383B',
  },
  navButtonText: {
    fontSize: 24,
    color: '#75383B',
    fontWeight: '700',
  },
  animalContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'relative',
  },
  animalImage: {
    width: 120,
    height: 120,
  },
  itemPreview: {
    position: 'absolute',
    bottom: 10,
    width: 60,
    height: 60,
  },
  animalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#75383B',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2DAB3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#75383B',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#75383B',
  },
  cancelButtonText: {
    color: '#75383B',
    fontSize: 17,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: '#75383B',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  successContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#75383B',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});
