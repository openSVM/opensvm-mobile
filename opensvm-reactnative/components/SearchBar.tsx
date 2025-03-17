import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Text, 
  useWindowDimensions, 
  Keyboard,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Search, X, Loader } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { parseSearchInput } from '@/utils/address-utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search transactions, accounts, blocks..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const router = useRouter();
  
  // Animation values
  const inputWidth = useRef(new Animated.Value(1)).current;
  const placeholderOpacity = useRef(new Animated.Value(1)).current;
  const searchIconOpacity = useRef(new Animated.Value(1)).current;
  const clearIconOpacity = useRef(new Animated.Value(0)).current;
  const loadingSpinValue = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  // Rotate animation for loading spinner
  const spin = loadingSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Start loading animation
  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.timing(loadingSpinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  // Handle search submission
  const handleSubmit = () => {
    if (query.trim()) {
      setIsSearching(true);
      startLoadingAnimation();
      
      // Parse the search query to determine what type of data it is
      const searchResult = parseSearchInput(query.trim());
      
      // Simulate search delay
      setTimeout(() => {
        onSearch(query.trim());
        
        // Navigate based on the type of input
        if (searchResult.isValid) {
          switch (searchResult.type) {
            case 'transaction':
              router.push(`/transaction/${searchResult.value}`);
              break;
            case 'account':
              router.push(`/account/${searchResult.value}`);
              break;
            case 'block':
              console.log(`Searching for block: ${searchResult.value}`);
              // router.push(`/block/${searchResult.value}`);
              break;
            default:
              console.log(`General search for: ${searchResult.value}`);
          }
        } else {
          console.log(`Invalid search query: ${query}`);
          // Could show an error message here
        }
        
        setIsSearching(false);
        Keyboard.dismiss();
      }, 1000);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: 1.05,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }),
      Animated.timing(placeholderOpacity, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: false
      })
    ]).start();
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(inputWidth, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }),
      Animated.timing(placeholderOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      })
    ]).start();
  };

  // Update clear button visibility based on query
  useEffect(() => {
    Animated.timing(clearIconOpacity, {
      toValue: query.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [query]);

  // Clear search input
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isSmall && styles.titleSmall]}>
        OpenSVM Explorer
      </Text>
      <Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
        The quieter you become, the more you are able to hear.
      </Text>
      
      <View style={styles.searchContainer}>
        <Animated.View 
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            { transform: [{ scale: inputWidth }] }
          ]}
        >
          {isSearching ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Loader size={18} color={colors.primary} />
            </Animated.View>
          ) : (
            <Animated.View style={{ opacity: searchIconOpacity }}>
              <Search size={18} color={isFocused ? colors.primary : colors.textSecondary} />
            </Animated.View>
          )}
          
          <TextInput
            ref={inputRef}
            style={[
              styles.input, 
              isSmall && styles.inputSmall,
              isFocused && styles.inputFocused
            ]}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {query.length > 0 && (
            <Animated.View style={{ opacity: clearIconOpacity }}>
              <TouchableOpacity onPress={handleClear}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
        
        <TouchableOpacity 
          style={[
            styles.button,
            isSearching && styles.buttonSearching
          ]} 
          onPress={handleSubmit}
          disabled={isSearching || query.trim().length === 0}
        >
          <Text style={[
            styles.buttonText, 
            isSmall && styles.buttonTextSmall,
            (isSearching || query.trim().length === 0) && styles.buttonTextDisabled
          ]}>
            {isSearching ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.mono,
  },
  titleSmall: {
    fontSize: 24,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: typography.mono,
  },
  subtitleSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    height: 48,
    shadowColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.1)' : 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    transition: 'all 0.3s ease',
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
    shadowColor: Platform.OS === 'ios' ? colors.primary + '40' : 'transparent',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.mono,
    height: '100%',
    paddingVertical: 8,
  },
  inputSmall: {
    fontSize: 14,
  },
  inputFocused: {
    color: colors.text,
  },
  button: {
    backgroundColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 48,
    minWidth: 100,
    transition: 'all 0.3s ease',
  },
  buttonSearching: {
    backgroundColor: colors.text + '80',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: typography.mono,
    textAlign: 'center',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
});