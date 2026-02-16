import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import TextStroke from '../TextStroke';

const { width: screenWidth } = Dimensions.get('window');

export default function EggPurchaseModal({
  visible,
  onClose,
  userCoins,
  onPurchase,
  navigation,
  allAnimalsCollected = false,
}) {
  const [purchasing, setPurchasing] = useState(false);
  const [isHatching, setIsHatching] = useState(false);
  const [hatchedAnimal, setHatchedAnimal] = useState(null);
  const [error, setError] = useState('');
  const animationRef = useRef(null);

  const EGG_PRICE = 200;

  useEffect(() => {
    if (visible) {
      setError('');
      setIsHatching(false);
      setHatchedAnimal(null);
    }
  }, [visible]);

  const handleBuy = async () => {
    setError('');

    if (allAnimalsCollected) {
      setError('You have already collected all animals');
      return;
    }

    if (userCoins < EGG_PRICE) {
      setError("Looks like you don't have enough coins! Continue logging activities to purchase");
      return;
    }

    setPurchasing(true);
    setIsHatching(true);

    try {
      // Make the purchase API call
      const response = await onPurchase({ id: 1, name: 'Egg', price: EGG_PRICE });

      // Animation will call handleAnimationFinish when complete
      // Store the hatched animal for when animation finishes
      setHatchedAnimal(response.hatchedAnimal);
    } catch (err) {
      setError(err.message || 'Purchase failed');
      setIsHatching(false);
      setHatchedAnimal(null);
    } finally {
      setPurchasing(false);
    }
  };

  const handleAnimationFinish = () => {
    setIsHatching(false);
  };

  const handleGoToSanctuary = () => {
    onClose();
    if (navigation) {
      navigation.navigate('Sanctuary');
    }
  };

  const getAnimalImage = (animal) => {
    const animalImages = {
      platypus: require('../../../assets/sanctuary/platypus.png'),
      cat: require('../../../assets/sanctuary/cat.png'),
      dinosaur: require('../../../assets/sanctuary/dinosaur.png'),
      raccoon: require('../../../assets/sanctuary/raccoon.png'),
    };
    return animalImages[animal] || animalImages.platypus;
  };

  const getAnimalDisplayName = (animal) => {
    return animal.charAt(0).toUpperCase() + animal.slice(1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          {/* Content */}
          {!isHatching && !hatchedAnimal && (
            <>
              {/* Egg Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../../assets/home/egg-icon.png')}
                  style={styles.eggImage}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <TextStroke stroke={3} color="#75383B">
                  <Text style={styles.title}>New Egg</Text>
                </TextStroke>
              </View>

              {/* Price and Buy Button */}
              <View style={styles.actionRow}>
                <View style={styles.priceBubble}>
                  <Text style={styles.priceText}>{EGG_PRICE}</Text>
                  <Image
                    source={require('../../../assets/home/coin-icon.png')}
                    style={styles.coinIcon}
                    resizeMode="contain"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.buyButton, (purchasing || allAnimalsCollected) && styles.buyButtonDisabled]}
                  onPress={handleBuy}
                  disabled={purchasing || allAnimalsCollected}
                >
                  <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>

              {/* Error message */}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}

          {/* Hatching Animation */}
          {isHatching && (
            <View style={styles.hatchingContainer}>
              <LottieView
                ref={animationRef}
                source={require('../../../assets/profile-completion/egg-hatching.json')}
                style={styles.hatchingAnimation}
                autoPlay
                loop={false}
                onAnimationFinish={handleAnimationFinish}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Hatched Animal */}
          {!isHatching && hatchedAnimal && (
            <>
              {/* Animal Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={getAnimalImage(hatchedAnimal)}
                  style={styles.animalImage}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <TextStroke stroke={3} color="#75383B">
                  <Text style={styles.title}>New Egg</Text>
                </TextStroke>
              </View>

              {/* Description */}
              <Text style={styles.description}>
                It's a {getAnimalDisplayName(hatchedAnimal)}! Go see it in the sanctuary.
              </Text>

              {/* Sanctuary Button */}
              <TouchableOpacity
                style={styles.sanctuaryButton}
                onPress={handleGoToSanctuary}
              >
                <Text style={styles.sanctuaryButtonText}>Sanctuary</Text>
              </TouchableOpacity>
            </>
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
    width: screenWidth * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 4,
    borderBottomWidth: 8,
    borderColor: '#75383B',
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 32,
    color: '#75383B',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  eggImage: {
    width: 100,
    height: 100,
  },
  animalImage: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    marginBottom: 14,
    paddingHorizontal: 3,
  },
  title: {
    fontFamily: 'Sigmar',
    fontSize: 32,
    color: '#F2DAB3',
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  priceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2DAB3',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    height: 28,
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75383B',
  },
  coinIcon: {
    width: 16,
    height: 16,
  },
  buyButton: {
    backgroundColor: '#F2DAB3',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75383B',
  },
  errorText: {
    color: '#75383B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
  hatchingContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hatchingAnimation: {
    width: 250,
    height: 250,
  },
  description: {
    fontSize: 17,
    fontWeight: '600',
    color: '#75383B',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  sanctuaryButton: {
    backgroundColor: '#F2DAB3',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  sanctuaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#75383B',
  },
});
