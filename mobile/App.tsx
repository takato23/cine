import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

type Movie = {
  id: string;
  title: string;
  synopsis: string;
  status: 'ESTRENO' | 'CARTELERA' | 'PROXIMAMENTE';
  duration: number;
  posterUrl?: string;
};

type Showtime = {
  id: string;
  movieId: string;
  roomId: string;
  startTime: string;
  format: string;
  language: string;
  room?: { name: string };
  movie?: Movie;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mv, sh, pr] = await Promise.all([
        axios.get(`${API_URL}/movies`),
        axios.get(`${API_URL}/showtimes`),
        axios.get(`${API_URL}/products`),
      ]);
      setMovies(mv.data);
      setShowtimes(sh.data);
      setProducts(pr.data);
    } catch (err) {
      console.error('Error cargando mock mobile', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const estrenos = useMemo(() => movies.filter((m) => m.status === 'ESTRENO'), [movies]);
  const cartelera = useMemo(() => movies.filter((m) => m.status === 'CARTELERA'), [movies]);

  const renderMovie = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.badge}>{item.status}</Text>
      <Text style={styles.textMuted}>{item.duration} min</Text>
      <Text numberOfLines={2} style={styles.textMuted}>
        {item.synopsis}
      </Text>
    </View>
  );

  const renderShowtime = ({ item }: { item: Showtime }) => (
    <View style={styles.showtimeCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.movie?.title || item.id}</Text>
        <Text style={styles.textMuted}>
          {new Date(item.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · {item.room?.name || item.roomId} · {item.format}
        </Text>
      </View>
      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>Elegir</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-AR')}</Text>
      </View>
      <Text style={styles.textMuted}>{item.category}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.textMuted}>Cargando mock...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Cinema Pergamino</Text>
          <Text style={styles.heroSubtitle}>Compra rápida de entradas y snacks (mock)</Text>
          <View style={styles.heroPills}>
            <Text style={styles.pill}>Roja</Text>
            <Text style={styles.pill}>Amarilla</Text>
            <Text style={styles.pill}>3D / IMAX</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estrenos</Text>
          <FlatList
            data={estrenos}
            renderItem={renderMovie}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>En Cartelera</Text>
          <FlatList
            data={cartelera}
            renderItem={renderMovie}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funciones de hoy</Text>
          <FlatList
            data={showtimes}
            renderItem={renderShowtime}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confitería</Text>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0f',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#111827',
  },
  heroTitle: {
    color: '#f3f4f6',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#9ca3af',
    marginTop: 6,
  },
  heroPills: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  pill: {
    color: '#fef2f2',
    backgroundColor: '#b91c1c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '600',
    overflow: 'hidden',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  sectionTitle: {
    color: '#f3f4f6',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    width: 220,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 14,
  },
  cardTitle: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    color: '#fecdd3',
    backgroundColor: '#7f1d1d',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  textMuted: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4,
  },
  showtimeCard: {
    width: 260,
    padding: 16,
    backgroundColor: '#111827',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cta: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
  productCard: {
    width: 220,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 14,
  },
  price: {
    color: '#f87171',
    fontWeight: '800',
  },
});
