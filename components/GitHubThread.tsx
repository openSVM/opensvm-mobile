import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { ChevronDown, ChevronUp, MessageSquare, GitPullRequest, Check, X, Calendar, ThumbsUp, ExternalLink } from 'lucide-react-native';
import { useGitHubDiscussions, GitHubComment } from '@/hooks/use-github-discussions';

interface GitHubThreadProps {
  showLatestFirst?: boolean;
}

export function GitHubThread({ showLatestFirst = true }: GitHubThreadProps) {
  const [expanded, setExpanded] = useState(true);
  const { prData, isLoading, error } = useGitHubDiscussions();
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading GitHub discussions...</Text>
      </View>
    );
  }

  if (error || !prData) {
    return (
      <View style={styles.errorContainer}>
        <X size={24} color={colors.error} />
        <Text style={styles.errorText}>Error loading GitHub discussions</Text>
        <Text style={styles.errorSubtext}>{error?.message || 'Unknown error'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { prNumber, prTitle, prAuthor, prDate, prStatus, comments, url } = prData;

  // Sort comments based on preference
  const sortedComments = [...comments];
  if (showLatestFirst) {
    sortedComments.reverse();
  }

  const openGitHubLink = (commentUrl: string) => {
    Linking.openURL(commentUrl || url);
  };

  const renderComment = (comment: GitHubComment) => (
    <View key={comment.id} style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{comment.author.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.authorName}>{comment.author}</Text>
          <Text style={styles.commentDate}>{comment.date}</Text>
        </View>
        <TouchableOpacity onPress={() => openGitHubLink(comment.url || url)}>
          <ExternalLink size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.commentContent}>
        {comment.isApproval && (
          <View style={[styles.statusBadge, styles.approvalBadge]}>
            <Check size={14} color={colors.success} />
            <Text style={[styles.statusText, styles.approvalText]}>Approved</Text>
          </View>
        )}
        
        {comment.isRejection && (
          <View style={[styles.statusBadge, styles.rejectionBadge]}>
            <X size={14} color={colors.error} />
            <Text style={[styles.statusText, styles.rejectionText]}>Changes Requested</Text>
          </View>
        )}
        
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <View style={styles.headerLeft}>
          <GitPullRequest 
            size={18} 
            color={
              prStatus === 'merged' ? '#8250df' : 
              prStatus === 'closed' ? colors.error : 
              '#1a7f37'
            } 
          />
          <Text style={styles.prTitle}>
            PR #{prNumber}: {prTitle}
          </Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={18} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.prInfo}>
          <View style={styles.prInfoRow}>
            <View style={styles.prStatusContainer}>
              <View style={[
                styles.prStatusBadge,
                prStatus === 'merged' ? styles.mergedBadge :
                prStatus === 'closed' ? styles.closedBadge :
                styles.openBadge
              ]}>
                {prStatus === 'merged' ? (
                  <GitPullRequest size={12} color="#fff" />
                ) : prStatus === 'closed' ? (
                  <X size={12} color="#fff" />
                ) : (
                  <GitPullRequest size={12} color="#fff" />
                )}
                <Text style={styles.prStatusText}>
                  {prStatus === 'merged' ? 'Merged' : 
                   prStatus === 'closed' ? 'Closed' : 
                   'Open'}
                </Text>
              </View>
              <Text style={styles.prAuthor}>{prAuthor}</Text>
              <Text style={styles.prDate}>
                <Calendar size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                {prDate}
              </Text>
            </View>
          </View>
          
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.viewToggleButton, styles.viewToggleButtonActive]}
              onPress={() => Linking.openURL(url)}
            >
              <Text style={styles.viewToggleText}>View on GitHub</Text>
              <ExternalLink size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.commentsContainer}>
            {sortedComments.map(renderComment)}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorText: {
    marginTop: 12,
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubtext: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surfaceLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  prTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  prInfo: {
    padding: 12,
  },
  prInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  prStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  prStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  openBadge: {
    backgroundColor: '#1a7f37',
  },
  closedBadge: {
    backgroundColor: colors.error,
  },
  mergedBadge: {
    backgroundColor: '#8250df',
  },
  prStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  prAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  prDate: {
    fontSize: 12,
    color: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewToggleButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  viewToggleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  commentsContainer: {
    gap: 12,
  },
  commentContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  commentDate: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  commentContent: {
    padding: 12,
  },
  commentText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  approvalBadge: {
    backgroundColor: colors.success + '20',
  },
  rejectionBadge: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  approvalText: {
    color: colors.success,
  },
  rejectionText: {
    color: colors.error,
  },
});