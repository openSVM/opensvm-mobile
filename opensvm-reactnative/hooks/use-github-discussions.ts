import { useState, useEffect } from 'react';

export interface GitHubComment {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
  reactions?: { emoji: string; count: number }[];
  isApproval?: boolean;
  isRejection?: boolean;
  url?: string;
}

export interface GitHubPR {
  prNumber: number;
  prTitle: string;
  prAuthor: string;
  prDate: string;
  prStatus: 'open' | 'closed' | 'merged';
  comments: GitHubComment[];
  url: string;
}

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'solana-foundation';
const REPO_NAME = 'solana-improvement-documents';
const PR_NUMBER = 228;

export function useGitHubDiscussions() {
  const [prData, setPRData] = useState<GitHubPR | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPRData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch PR details
        const prResponse = await fetch(
          `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${PR_NUMBER}`
        );
        
        if (!prResponse.ok) {
          throw new Error(`GitHub API error: ${prResponse.status}`);
        }
        
        const prDetails = await prResponse.json();
        
        // Fetch PR comments
        const commentsResponse = await fetch(
          `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${PR_NUMBER}/comments`
        );
        
        if (!commentsResponse.ok) {
          throw new Error(`GitHub API error: ${commentsResponse.status}`);
        }
        
        const commentsData = await commentsResponse.json();
        
        // Fetch issue comments (PR description and regular comments)
        const issueCommentsResponse = await fetch(
          `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/issues/${PR_NUMBER}/comments`
        );
        
        if (!issueCommentsResponse.ok) {
          throw new Error(`GitHub API error: ${issueCommentsResponse.status}`);
        }
        
        const issueCommentsData = await issueCommentsResponse.json();
        
        // Format the data
        const formattedComments: GitHubComment[] = [
          // Add PR description as first comment
          {
            id: `pr-${prDetails.id}`,
            author: prDetails.user.login,
            authorAvatar: prDetails.user.avatar_url,
            date: new Date(prDetails.created_at).toLocaleDateString(),
            content: prDetails.body || 'No description provided',
            url: prDetails.html_url
          },
          // Add issue comments
          ...issueCommentsData.map((comment: any) => ({
            id: `issue-${comment.id}`,
            author: comment.user.login,
            authorAvatar: comment.user.avatar_url,
            date: new Date(comment.created_at).toLocaleDateString(),
            content: comment.body,
            isApproval: comment.body.toLowerCase().includes('approve') || comment.body.toLowerCase().includes('lgtm'),
            isRejection: comment.body.toLowerCase().includes('request changes') || comment.body.toLowerCase().includes('needs work'),
            url: comment.html_url
          })),
          // Add PR review comments
          ...commentsData.map((comment: any) => ({
            id: `review-${comment.id}`,
            author: comment.user.login,
            authorAvatar: comment.user.avatar_url,
            date: new Date(comment.created_at).toLocaleDateString(),
            content: comment.body,
            url: comment.html_url
          }))
        ];
        
        // Sort comments by date (oldest first)
        formattedComments.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setPRData({
          prNumber: PR_NUMBER,
          prTitle: prDetails.title,
          prAuthor: prDetails.user.login,
          prDate: new Date(prDetails.created_at).toLocaleDateString(),
          prStatus: prDetails.state as any,
          comments: formattedComments,
          url: prDetails.html_url
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err as Error);
        
        // Fallback to mock data in case of error
        setPRData({
          prNumber: PR_NUMBER,
          prTitle: "Market-Based Emission Mechanism",
          prAuthor: "tusharjain",
          prDate: "Jan 16, 2025",
          prStatus: "open",
          comments: [
            {
              id: "fallback-1",
              author: "GitHub API Error",
              authorAvatar: "",
              date: new Date().toLocaleDateString(),
              content: "Unable to fetch real GitHub discussions. Please check your internet connection or try again later.",
            }
          ],
          url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${PR_NUMBER}`
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPRData();
  }, []);

  return { prData, isLoading, error };
}