import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';

type Evenement = {
  ID: string;
  Titre: string;
  Categorie: string;
  Capacite: number;
  Inscrits: number;
};

const evenements: Evenement[] = [
  { ID: 'E01', Titre: 'Atelier React', Categorie: 'Atelier', Capacite: 25, Inscrits: 25 },
  { ID: 'E02', Titre: 'Conférence IA', Categorie: 'Conférence', Capacite: 70, Inscrits: 52 },
  { ID: 'E03', Titre: 'Sécurité mobile', Categorie: 'Atelier', Capacite: 20, Inscrits: 17 },
  { ID: 'E04', Titre: 'Design UI', Categorie: 'Atelier', Capacite: 18, Inscrits: 9 },
  { ID: 'E05', Titre: 'Forum projets', Categorie: 'Rencontre', Capacite: 50, Inscrits: 49 },
  { ID: 'E06', Titre: 'Découverte Git', Categorie: 'Atelier', Capacite: 24, Inscrits: 24 }
];

function PlacesRestantes ({ Capacite, Inscrits }: Evenement) {
  const PlaceReste = Capacite - Inscrits;
  return (
    <Text>
      { PlaceReste > 0 ? <Text>{ PlaceReste }</Text> : <Text>valeur négative</Text> }
    </Text>
  );
}

function StatutEvenement (e: Evenement) {
  const r = e.Capacite - e.Inscrits;
  return (
    r === 0 ? "Complet" : r >= 1 && r <= 3 ? "Presque complet" : r >= 4 ? "Ouvert" : "valeur négative"
  );
}

function BadgeStatut ({ statut }: { statut: any }) {
  const badgeCouleur = 
    statut === "Complet" ? styles.badgeComplet :
    statut === "Presque complet" ? styles.badgePresqueComplet : 
    styles.badgeOuvert;

  return (
    <View style={[styles.badge, badgeCouleur]}>
      <Text style={styles.texteBadge}>
        { statut }
      </Text>
    </View>
  );
}

type CarteProps = { evenement : Evenement };

function CarteEvenement ( { evenement } : CarteProps ) {
  const { Titre, Categorie } = evenement;
  const placeReste = evenement.Capacite - evenement.Inscrits;
  const statut = StatutEvenement (evenement);
  
  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>{ Titre }</Text>
      <Text style={styles.categorie}>Catégorie : { Categorie }</Text>
      <Text style={styles.texte}>Places restantes : { placeReste }</Text>
      <BadgeStatut statut={statut} />
    </View>
  );
}

type BlocProps = { libelle : string, nombre : number };

function BlocStatistique ( { libelle, nombre } : BlocProps ) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.nombre}>{ nombre }</Text>
      <Text style={styles.libelle}>{ libelle }</Text>
    </View>
  );
}

export default function App () {
  const total = evenements.length;
  const sommePlaces = evenements.reduce((somme, e) => {
    const r = e.Capacite - e.Inscrits;
    return somme + (r > 0 ? r : 0);
  }, 0);

  const mode = 'tous';

  const donnees = evenements.filter (e => {
    const r = e.Capacite - e.Inscrits;
    if (mode === 'tous') {
      return true;
    } else {
      return e.Categorie === 'Atelier' && r > 0;
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CampusAgenda</Text>
        <Text style={styles.headerSubtitle}>Événements du campus</Text>
      </View>

      <View style={styles.statsRow}>
        <BlocStatistique libelle="événements" nombre={total} />
        <BlocStatistique libelle="places libres" nombre={sommePlaces} />
      </View>

      <FlatList
        data={donnees}
        keyExtractor={item => item.ID}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f4f6f8', flexGrow: 1 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  bloc: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  libelle: { fontSize: 13, color: '#555', marginTop: 4 },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  carte: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  titre: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  categorie: { fontSize: 14, color: '#666', marginVertical: 4 },
  texte: { fontSize: 14, color: '#444', marginBottom: 10 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeComplet: { backgroundColor: '#ffd6d6' },
  badgePresqueComplet: { backgroundColor: '#ffe5cc' },
  badgeOuvert: { backgroundColor: '#d4edda' },
  texteBadge: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});
