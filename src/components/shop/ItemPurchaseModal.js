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
import TextStroke from '../TextStroke';

const { width } = Dimensions.get('window');

// Available animals with hula skirt variants
// User will import these images - using placeholders for now
const ANIMALS_WITH_SKIRT = [
  { id: 'platypus', name: 'Platypus', image: require('../../../assets/shop/platypus-hula.png'), icon: require('../../../assets/shop/platypus-icon.png') },
  { id: 'dinosaur', name: 'Dinosaur', image: require('../../../assets/shop/dinosaur-hula.png'), icon: require('../../../assets/shop/dinosaur-icon.png') },
  { id: 'raccoon', name: 'Raccoon', image: require('../../../assets/shop/raccoon-hula.png'), icon: require('../../../assets/shop/raccoon-icon.png') },
  { id: 'cat', name: 'Cat', image: require('../../../assets/shop/cat-hula.png'), icon: require('../../../assets/shop/cat-icon.png') },
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

  const handleAnimalSelect = (index) => {
    setSelectedAnimal(index);
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
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {!success ? (
            <>
              {/* Animal Preview */}
              <View style={styles.animalPreview}>
                <Image
                  source={ANIMALS_WITH_SKIRT[selectedAnimal].image}
                  style={styles.animalImage}
                  resizeMode="contain"
                />
              </View>

              {/* Animal Selector Buttons */}
              <View style={styles.animalSelector}>
                {ANIMALS_WITH_SKIRT.map((animal, index) => (
                  <TouchableOpacity
                    key={animal.id}
                    style={[
                      styles.animalButton,
                      selectedAnimal === index && styles.animalButtonSelected
                    ]}
                    onPress={() => handleAnimalSelect(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={animal.icon}
                      style={styles.animalButtonIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Title */}
              <TextStroke stroke={3} color="#75383B">
                <Text style={styles.title}>{item.name}</Text>
              </TextStroke>

              {/* Price and Buy Row */}
              <View style={styles.actionRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <Image
                    source={require('../../../assets/home/coin-icon.png')}
                    style={styles.coinIcon}
                    resizeMode="contain"
                  />
                </View>

                <TouchableOpacity 
                  style={styles.buyButton}
                  onPress={handleBuy}
                  activeOpacity={0.8}
                  disabled={purchasing}
                >
                  <Text style={styles.buyButtonText}>
                    {purchasing ? 'Buying...' : 'Buy'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 12,
    borderColor: '#75383B',
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#75383B',
  },
  animalPreview: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  animalImage: {
    width: 120,
    height: 120,
  },
  animalSelector: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  animalButton: {
    width: 34,
    height: 34,
    backgroundColor: '#F2DAB3',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  animalButtonSelected: {
    opacity: 0.5,
  },
  animalButtonIcon: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    fontFamily: 'Sigmar',
    color: '#F2DAB3',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2DAB3',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    height: 28,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75383B',
    marginRight: 4,
  },
  coinIcon: {
    width: 16,
    height: 16,
  },
  buyButton: {
    backgroundColor: '#F2DAB3',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75383B',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
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
