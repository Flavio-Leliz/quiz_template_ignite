import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { HouseLine, Trash } from 'phosphor-react-native';

import { Header } from '../../components/Header';
import { HistoryCard, HistoryProps } from '../../components/HistoryCard';

import { styles } from './styles';
import { historyGetAll, historyRemove } from '../../storage/quizHistoryStorage';
import { Loading } from '../../components/Loading';
import Animated, { Layout, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { THEME } from '../../styles/theme';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipeableRefs = useRef<Swipeable[]>([])

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string, index: number) {
    swipeableRefs.current?.[index].close(); // fechando o menu atraves do index passado pelo map
    Alert.alert(
      'Remover',
      'Deseja remover esse registro?',
      [
        {
          text: 'Sim', onPress: () => remove(id)
        },
        { text: 'Não', style: 'cancel' }
      ]
    );

  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${'\n'}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {
          history.map((item, index) => (
            <Animated.View
              entering={SlideInRight}
              exiting={SlideOutLeft}
              layout={Layout.springify()}
              key={item.id}
            >
              <Swipeable
                ref={(ref) => {          // pegando ref para fechar o menu
                  if (ref) {
                    swipeableRefs.current.push(ref)
                  }
                }}
                overshootRight={false}
                containerStyle={styles.swipeableContainer}
                onSwipeableOpen={() => handleRemove(item.id, index)} // chamar função ao deslizar
                rightThreshold={10}
                renderLeftActions={() => null} // iOS
                renderRightActions={() => (
                  // <Pressable
                  //   style={styles.swipeableRemove}
                  //   onPress={() => handleRemove(item.id, index)}
                  // >
                  //   <Trash
                  //     size={32}
                  //     color={THEME.COLORS.GREY_100}
                  //   />
                  // </Pressable>
                  <View
                    style={styles.swipeableRemove}
                  >
                    <Trash
                      size={32}
                      color={THEME.COLORS.GREY_100}
                    />
                  </View>
                )}
              >
                <HistoryCard data={item} />
              </Swipeable>
            </Animated.View>
          ))
        }
      </ScrollView >
    </View >
  );
}