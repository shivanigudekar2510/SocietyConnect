import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, TextInput, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert 
} from 'react-native';
import { useAppContext, Poll, Classified } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Existing shape of a Community Post
interface Post {
  id: string;
  authorName: string;
  authorUnit: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const CommunityScreen = () => {
  const { polls, votePoll, createPoll, classifieds, addClassified } = useAppContext();
  const [activeTab, setActiveTab] = useState<'feed' | 'polls' | 'market'>('feed');
  const [newPostText, setNewPostText] = useState('');
  
  // Poll creation form state
  const [showAddPoll, setShowAddPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');

  // Classified creation form state
  const [showAddItem, setShowAddItem] = useState(false);
  const [classTitle, setClassTitle] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classPrice, setClassPrice] = useState('');
  const [classContact, setClassContact] = useState('');
  const [classCategory, setClassCategory] = useState<'Sale' | 'Rent' | 'Services' | 'Carpool'>('Sale');

  // Existing Feed mock data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      authorName: 'Vaibhavi Rumale',
      authorUnit: 'Flat 302',
      avatar: 'V',
      time: '2 hours ago',
      content: "What an incredible weekend at the Author Talks 2026! A massive thank you to everyone who attended and made it a huge success. The Amateur Writers Club is so grateful for the community's support. 📚✨",
      likes: 24,
      comments: 5,
      isLiked: true,
    },
    {
      id: '2',
      authorName: 'Suryakant Shinde',
      authorUnit: 'Flat 105',
      avatar: 'S',
      time: 'Yesterday',
      content: 'Reminder: Don\'t miss our society\'s drama troupe performing "Parampara se pragati tak" this Sunday evening at the clubhouse! It\'s a beautiful journey through our social progress. See you there! 🎭',
      likes: 42,
      comments: 8,
      isLiked: false,
    },
    {
      id: '3',
      authorName: 'Rahul Sharma',
      authorUnit: 'Flat 504',
      avatar: 'R',
      time: 'April 27',
      content: 'Is anyone looking for a carpool to the Hinjewadi IT Park? I leave around 8:30 AM daily and have 3 empty seats. DM me if interested! 🚗',
      likes: 12,
      comments: 3,
      isLiked: false,
    }
  ]);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handlePostSubmit = () => {
    if (!newPostText.trim()) return;
    const np: Post = {
      id: Date.now().toString(),
      authorName: 'You (Flat 402)',
      authorUnit: 'Flat 402',
      avatar: 'U',
      time: 'Just now',
      content: newPostText,
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts([np, ...posts]);
    setNewPostText('');
  };

  // Poll Functions
  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !pollOpt1.trim() || !pollOpt2.trim()) return;
    createPoll({
      question: pollQuestion,
      options: [pollOpt1, pollOpt2]
    });
    setPollQuestion('');
    setPollOpt1('');
    setPollOpt2('');
    setShowAddPoll(false);
    Alert.alert('Success', 'Poll created successfully!');
  };

  // Marketplace Functions
  const handleCreateClassified = () => {
    if (!classTitle.trim() || !classPrice.trim() || !classContact.trim()) return;
    addClassified({
      title: classTitle,
      description: classDesc,
      price: classPrice,
      contact: classContact,
      flat: 'Flat 402',
      category: classCategory
    });
    setClassTitle('');
    setClassDesc('');
    setClassPrice('');
    setClassContact('');
    setShowAddItem(false);
    Alert.alert('Success', 'Item posted to marketplace!');
  };

  const renderFeedPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.authorMeta}>{item.authorUnit} • {item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.divider} />
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Dynamic Main Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Society Hub</Text>
        <Text style={styles.headerSubtitle}>Connect with neighbors & share polls</Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'feed' && styles.tabButtonActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Icon name="chatbox-ellipses" size={18} color={activeTab === 'feed' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabButtonText, activeTab === 'feed' && styles.tabButtonTextActive]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'polls' && styles.tabButtonActive]}
          onPress={() => setActiveTab('polls')}
        >
          <Icon name="stats-chart" size={18} color={activeTab === 'polls' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabButtonText, activeTab === 'polls' && styles.tabButtonTextActive]}>Polls</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'market' && styles.tabButtonActive]}
          onPress={() => setActiveTab('market')}
        >
          <Icon name="cart" size={18} color={activeTab === 'market' ? '#2563EB' : '#6B7280'} />
          <Text style={[styles.tabButtonText, activeTab === 'market' && styles.tabButtonTextActive]}>Market</Text>
        </TouchableOpacity>
      </View>

      {/* Content area filtered by activeTab */}
      <View style={styles.mainContent}>
        {activeTab === 'feed' && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={renderFeedPost}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListHeaderComponent={
                <View style={styles.createPostContainer}>
                  <View style={[styles.avatarContainer, { width: 40, height: 40, backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.avatarText, { fontSize: 16, color: '#0284C7' }]}>Me</Text>
                  </View>
                  <TextInput
                    style={styles.createPostInput}
                    placeholder="What's happening in the society?"
                    placeholderTextColor="#9CA3AF"
                    value={newPostText}
                    onChangeText={setNewPostText}
                    multiline
                  />
                  {newPostText.length > 0 && (
                    <TouchableOpacity style={styles.postButton} onPress={handlePostSubmit}>
                      <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          </KeyboardAvoidingView>
        )}

        {activeTab === 'polls' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Active Society Polls</Text>
              <TouchableOpacity style={styles.headerActionPill} onPress={() => setShowAddPoll(!showAddPoll)}>
                <Icon name={showAddPoll ? 'close-circle' : 'add-circle'} size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>{showAddPoll ? 'Cancel' : 'Create'}</Text>
              </TouchableOpacity>
            </View>

            {showAddPoll && (
              <View style={styles.addCard}>
                <Text style={styles.addCardTitle}>New Society Poll</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Poll Question"
                  placeholderTextColor="#9CA3AF"
                  value={pollQuestion}
                  onChangeText={setPollQuestion}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Option 1"
                  placeholderTextColor="#9CA3AF"
                  value={pollOpt1}
                  onChangeText={setPollOpt1}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Option 2"
                  placeholderTextColor="#9CA3AF"
                  value={pollOpt2}
                  onChangeText={setPollOpt2}
                />
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreatePoll}>
                  <Text style={styles.submitBtnText}>Launch Poll</Text>
                </TouchableOpacity>
              </View>
            )}

            {polls.map((poll: Poll) => {
              const hasVoted = poll.votedBy.includes('Flat 402');
              let totalVotes = 0;
              Object.values(poll.votes).forEach(v => { totalVotes += v; });

              return (
                <View key={poll.id} style={styles.pollCard}>
                  <View style={styles.pollHeader}>
                    <Icon name="bar-chart" size={20} color="#6366F1" />
                    <Text style={styles.pollTitle}>Resident Poll</Text>
                  </View>
                  <Text style={styles.pollQuestion}>{poll.question}</Text>

                  <View style={styles.pollOptionsArea}>
                    {poll.options.map((opt) => {
                      const votesForOpt = poll.votes[opt] || 0;
                      const pct = totalVotes > 0 ? Math.round((votesForOpt / totalVotes) * 100) : 0;

                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.pollOptBtn, hasVoted && styles.pollOptBtnVoted]}
                          disabled={hasVoted}
                          onPress={() => votePoll(poll.id, opt, 'Flat 402')}
                        >
                          <View style={styles.pollOptDetails}>
                            <Text style={[styles.pollOptText, hasVoted && styles.pollOptTextVoted]}>{opt}</Text>
                            {hasVoted && <Text style={styles.pollOptPct}>{pct}% ({votesForOpt} votes)</Text>}
                          </View>
                          {hasVoted && (
                            <View style={[styles.pollBarFill, { width: `${pct}%` }]} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {activeTab === 'market' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Marketplace & Listings</Text>
              <TouchableOpacity style={styles.headerActionPill} onPress={() => setShowAddItem(!showAddItem)}>
                <Icon name={showAddItem ? 'close-circle' : 'add-circle'} size={18} color="#FFFFFF" />
                <Text style={styles.headerActionText}>{showAddItem ? 'Cancel' : 'Post ad'}</Text>
              </TouchableOpacity>
            </View>

            {showAddItem && (
              <View style={styles.addCard}>
                <Text style={styles.addCardTitle}>List an item / service</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Listing Title"
                  placeholderTextColor="#9CA3AF"
                  value={classTitle}
                  onChangeText={setClassTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  placeholderTextColor="#9CA3AF"
                  value={classDesc}
                  onChangeText={setClassDesc}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price (e.g. ₹2,000)"
                  placeholderTextColor="#9CA3AF"
                  value={classPrice}
                  onChangeText={setClassPrice}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Contact"
                  placeholderTextColor="#9CA3AF"
                  value={classContact}
                  onChangeText={setClassContact}
                  keyboardType="phone-pad"
                />
                {/* Category selectors */}
                <Text style={styles.labelSmall}>Category</Text>
                <View style={styles.categoryRow}>
                  {(['Sale', 'Rent', 'Services', 'Carpool'] as const).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catBtn, classCategory === cat && styles.catBtnActive]}
                      onPress={() => setClassCategory(cat)}
                    >
                      <Text style={[styles.catBtnText, classCategory === cat && styles.catBtnTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateClassified}>
                  <Text style={styles.submitBtnText}>Publish Listing</Text>
                </TouchableOpacity>
              </View>
            )}

            {classifieds.map((item: Classified) => (
              <View key={item.id} style={styles.classCard}>
                <View style={styles.classCardHeader}>
                  <Text style={styles.classCategoryBadge}>{item.category}</Text>
                  <Text style={styles.classFlatText}>By {item.flat}</Text>
                </View>
                <Text style={styles.classTitleText}>{item.title}</Text>
                <Text style={styles.classDescText}>{item.description}</Text>
                <View style={styles.classFooter}>
                  <Text style={styles.classPriceText}>{item.price}</Text>
                  <TouchableOpacity 
                    style={styles.classContactBtn}
                    onPress={() => Alert.alert('Contact Owner', `Reach out at: ${item.contact}`)}
                  >
                    <Icon name="call" size={14} color="#FFFFFF" />
                    <Text style={styles.classContactBtnText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { paddingHorizontal: 20, paddingVertical: 18, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, backgroundColor: '#FFFFFF', paddingBottom: 5, gap: 10 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent', gap: 6 },
  tabButtonActive: { borderBottomColor: '#2563EB' },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabButtonTextActive: { color: '#2563EB' },

  mainContent: { flex: 1 },
  listContainer: { padding: 18, paddingBottom: 110 },
  scrollContent: { padding: 20, paddingBottom: 110 },

  createPostContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5 },
  createPostInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827', maxHeight: 100 },
  postButton: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 10 },
  postButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },

  postCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarContainer: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#9333EA' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  authorMeta: { fontSize: 13, color: '#6B7280' },
  postContent: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  actionBar: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  actionIcon: { fontSize: 18, marginRight: 6 },
  actionText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  actionTextActive: { color: '#DC2626' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerActionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 4 },
  headerActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  addCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  addCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 14 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 12, fontSize: 14, color: '#0F172A', marginBottom: 10 },
  labelSmall: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 15 },
  catBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
  catBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  catBtnText: { color: '#475569', fontSize: 12, fontWeight: '500' },
  catBtnTextActive: { color: '#2563EB', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  pollCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04 },
  pollHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  pollTitle: { fontSize: 13, color: '#6366F1', fontWeight: 'bold', textTransform: 'uppercase' },
  pollQuestion: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 15, lineHeight: 22 },
  pollOptionsArea: { gap: 10 },
  pollOptBtn: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, borderRadius: 14, position: 'relative', overflow: 'hidden' },
  pollOptBtnVoted: { borderColor: '#CBD5E1', backgroundColor: '#F1F5F9' },
  pollOptDetails: { flexDirection: 'row', justifyContent: 'space-between', zIndex: 2 },
  pollOptText: { color: '#1E293B', fontSize: 14, fontWeight: '600' },
  pollOptTextVoted: { color: '#334155' },
  pollOptPct: { color: '#2563EB', fontWeight: 'bold', fontSize: 13 },
  pollBarFill: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: '#E0F2FE', zIndex: 1, opacity: 0.5 },

  classCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04 },
  classCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  classCategoryBadge: { backgroundColor: '#FEF3C7', color: '#D97706', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  classFlatText: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  classTitleText: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  classDescText: { fontSize: 13, color: '#334155', lineHeight: 18, marginBottom: 12 },
  classFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  classPriceText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  classContactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, gap: 6 },
  classContactBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }
});

export default CommunityScreen;