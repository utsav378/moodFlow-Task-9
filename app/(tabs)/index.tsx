import { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Sentiment from "sentiment";

export default function Index() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<{text: string, mood: string, score: number, date: string}[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showHistory, setShowHistory] = useState(false);

  const sentiment = new Sentiment();
  
  // Enhanced word dictionary for better sentiment detection
  const customWords = {
    // Very Positive words (+3 to +5)
    'extraordinary': 5,
    'amazing': 5,
    'fantastic': 5,
    'incredible': 5,
    'wonderful': 4,
    'excellent': 4,
    'brilliant': 4,
    'outstanding': 5,
    'superb': 4,
    'fabulous': 4,
    'marvelous': 4,
    'spectacular': 5,
    'phenomenal': 5,
    'magnificent': 5,
    'awesome': 4,
    'terrific': 4,
    'delightful': 3,
    'lovely': 3,
    'beautiful': 3,
    'perfect': 4,
    'blessed': 3,
    'grateful': 3,
    'thrilled': 4,
    'excited': 3,
    'joyful': 4,
    'ecstatic': 5,
    'elated': 4,
    
    // Positive words (+1 to +2)
    'good': 2,
    'nice': 2,
    'fine': 1,
    'okay': 1,
    'happy': 3,
    'glad': 2,
    'pleased': 2,
    'content': 2,
    'hopeful': 2,
    'optimistic': 3,
    'positive': 2,
    'better': 2,
    'improving': 2,
    
    // Very Negative words (-3 to -5)
    'terrible': -4,
    'horrible': -4,
    'awful': -4,
    'devastating': -5,
    'miserable': -4,
    'depressed': -4,
    'hopeless': -5,
    'worthless': -5,
    'dreadful': -4,
    'disastrous': -5,
    'catastrophic': -5,
    'nightmare': -4,
    'unbearable': -5,
    'agonizing': -5,
    
    // Negative words (-1 to -2)
    'bad': -2,
    'sad': -2,
    'upset': -2,
    'angry': -3,
    'frustrated': -2,
    'annoyed': -2,
    'disappointed': -2,
    'worried': -2,
    'anxious': -3,
    'stressed': -3,
    'tired': -1,
    'exhausted': -2,
    'lonely': -2,
    'hurt': -2,
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const getMoodEmoji = (s: number) => {
    if (s > 5) return "🌟";
    if (s > 3) return "🌞";
    if (s > 0) return "🙂";
    if (s === 0) return "😐";
    if (s > -3) return "😞";
    if (s > -5) return "😢";
    return "💀";
  };

  const getMoodColor = (s: number) => {
    if (s > 5) return "#fbbf24";
    if (s > 3) return "#fbbf24";
    if (s > 0) return "#34d399";
    if (s === 0) return "#94a3b8";
    if (s > -3) return "#fb923c";
    if (s > -5) return "#f87171";
    return "#ef4444";
  };



  const analyzeMood = () => {
    if (!text.trim()) return;

    // Use sentiment with custom words
    const result = sentiment.analyze(text, { extras: customWords });
    let s = result.score;
    
    // Boost the score based on word intensity
    const words = text.toLowerCase().split(/\s+/);
    let boostScore = 0;
    
    words.forEach((word: string) => {
      const cleanWord = word.replace(/[^\w\s]/g, '');
      if (customWords[cleanWord as keyof typeof customWords]) {
        boostScore += customWords[cleanWord as keyof typeof customWords];
      }
    });
    
    // Combine scores with weighted boost
    s = Math.round(s + (boostScore * 0.5));
    
    setScore(s);

    let moodText = "";
    if (s > 5) moodText = "Extremely Positive";
    else if (s > 3) moodText = "Very Positive";
    else if (s > 0) moodText = "Positive";
    else if (s === 0) moodText = "Neutral";
    else if (s > -3) moodText = "Negative";
    else if (s > -5) moodText = "Very Negative";
    else moodText = "Extremely Negative";

    setMood(moodText);

    // Add to history
    const newEntry = {
      text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
      mood: moodText,
      score: s,
      date: new Date().toLocaleString()
    };
    setHistory((prev: {text: string, mood: string, score: number, date: string}[]) => [newEntry, ...prev].slice(0, 5));

    // Animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const clearAnalysis = () => {
    setText("");
    setMood("");
    setScore(null);
    fadeAnim.setValue(0);
  };

  const getSuggestions = () => {
    const suggestions = [
      "I feel amazing today! 🌟",
      "Today was extraordinary and wonderful!",
      "I'm feeling sad and lonely 😔",
      "This is terrible, I'm so stressed",
      "Just a normal day, nothing special",
      "I'm grateful and blessed 🙏",
    ];
    return suggestions;
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header with animated emoji */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Text style={styles.headerEmoji}>🧠</Text>
        </Animated.View>
        
        <Text style={styles.title}>MoodFlow</Text>
        <Text style={styles.subtitle}>Express yourself, discover your vibe ✨</Text>

        {/* Quick Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try these:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {getSuggestions().map((suggestion: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setText(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion.substring(0, 25)}...</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>How are you feeling?</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your thoughts here..."
            placeholderTextColor="#64748b"
            multiline
            value={text}
            onChangeText={setText}
            maxLength={500}
          />
          <Text style={styles.charCount}>{text.length}/500</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.analyzeButton]} 
            onPress={analyzeMood}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>✨ Analyze Mood</Text>
          </TouchableOpacity>
          
          {text.length > 0 && (
            <TouchableOpacity 
              style={[styles.button, styles.clearButton]} 
              onPress={clearAnalysis}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Result Card with Animation */}
        {mood && score !== null && (
          <Animated.View 
            style={[
              styles.resultCard, 
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                borderColor: getMoodColor(score),
              }
            ]}
          >
            <View style={styles.moodHeader}>
              <Text style={[styles.resultEmoji, { color: getMoodColor(score) }]}>
                {getMoodEmoji(score)}
              </Text>
              <View style={styles.moodTextContainer}>
                <Text style={[styles.resultMood, { color: getMoodColor(score) }]}>
                  {mood}
                </Text>
                <Text style={styles.resultScore}>
                  Score: <Text style={{ fontWeight: "800", color: getMoodColor(score) }}>{score}</Text>
                </Text>
              </View>
            </View>

            {/* Mood Bar */}
            <View style={styles.moodBarContainer}>
              <View style={styles.moodBarBackground}>
                <Animated.View 
                  style={[
                    styles.moodBarFill,
                    { 
                      width: `${Math.min(Math.abs(score) * 8, 100)}%`,
                      backgroundColor: getMoodColor(score),
                    }
                  ]}
                />
              </View>
              <Text style={styles.moodBarLabel}>Intensity: {Math.abs(score)}</Text>
            </View>

            {/* Tip */}
            <View style={[styles.tipCard, { backgroundColor: getMoodColor(score) + '20' }]}>
              <Text style={styles.tip}>
                {score > 5
                  ? "🌟 Incredible energy! You're absolutely glowing!"
                  : score > 3
                  ? "💫 Keep riding this positive wave!"
                  : score > 0
                  ? "😊 Good vibes! Keep it up!"
                  : score === 0
                  ? "🌿 Peace and balance — a beautiful state"
                  : score > -3
                  ? "💙 It's okay to feel this way. Take care of yourself"
                  : score > -5
                  ? "💜 Remember: tough times don't last, tough people do"
                  : "🫂 You're going through a lot. Please reach out to someone"}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* History Toggle */}
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.historyToggle}
            onPress={() => setShowHistory(!showHistory)}
            activeOpacity={0.7}
          >
            <Text style={styles.historyToggleText}>
              {showHistory ? "Hide" : "Show"} Recent History ({history.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>📊 Recent Moods</Text>
            {history.map((entry: {text: string, mood: string, score: number, date: string}, index: number) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyMood}>
                    {getMoodEmoji(entry.score)} {entry.mood}
                  </Text>
                  <Text style={[styles.historyScore, { color: getMoodColor(entry.score) }]}>
                    {entry.score}
                  </Text>
                </View>
                <Text style={styles.historyText}>{entry.text}</Text>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🤖 Powered by Enhanced Sentiment Analysis AI
          </Text>
          <Text style={styles.footerSubtext}>
            Detects 50+ emotion words with advanced scoring
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#0f172a",
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerEmoji: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#38bdf8",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  suggestionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  suggestionsTitle: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  suggestionsScroll: {
    flexDirection: "row",
  },
  suggestionChip: {
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  suggestionText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  inputCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#334155",
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    color: "#fff",
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#334155",
  },
  charCount: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 24,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    flex: 1,
  },
  analyzeButton: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  clearButton: {
    backgroundColor: "#475569",
    maxWidth: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  clearButtonText: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    marginTop: 10,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
  },
  moodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resultEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  moodTextContainer: {
    flex: 1,
  },
  resultMood: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  resultScore: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
  },
  moodBarContainer: {
    marginBottom: 20,
  },
  moodBarBackground: {
    height: 8,
    backgroundColor: "#0f172a",
    borderRadius: 4,
    overflow: "hidden",
  },
  moodBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  moodBarLabel: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 6,
    textAlign: "right",
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
  },
  tip: {
    color: "#e2e8f0",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },
  historyToggle: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
  },
  historyToggleText: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "600",
  },
  historySection: {
    width: "100%",
    marginTop: 20,
  },
  historyTitle: {
    color: "#cbd5e1",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyMood: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  historyScore: {
    fontSize: 16,
    fontWeight: "700",
  },
  historyText: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  },
  historyDate: {
    color: "#64748b",
    fontSize: 12,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    alignItems: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  footerSubtext: {
    color: "#475569",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
});