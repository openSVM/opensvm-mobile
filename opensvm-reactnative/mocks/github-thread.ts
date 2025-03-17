export const githubPR228Thread = {
  prNumber: 228,
  prTitle: "Market-Based Emission Mechanism",
  prAuthor: "tusharjain",
  prDate: "Jan 16, 2025",
  prStatus: "open" as const,
  comments: [
    {
      id: "c1",
      author: "tusharjain",
      authorAvatar: "",
      date: "Jan 16, 2025",
      content: "This PR introduces a market-based emission mechanism that adjusts Solana's inflation rate based on staking participation. As more SOL is staked, the emission rate decreases, optimizing network security while minimizing unnecessary inflation.",
      reactions: [
        { emoji: "👍", count: 42 },
        { emoji: "🚀", count: 23 }
      ],
      replies: [
        {
          id: "c1r1",
          author: "anatoly",
          authorAvatar: "",
          date: "Jan 17, 2025",
          content: "I like the direction of this proposal. It makes sense to have the emission rate respond to market conditions rather than being fixed. Have you considered how this might impact validator economics in the short term?",
          reactions: [
            { emoji: "👍", count: 15 }
          ]
        },
        {
          id: "c1r2",
          author: "tusharjain",
          authorAvatar: "",
          date: "Jan 17, 2025",
          content: "Thanks for the feedback! We've analyzed the short-term impact on validators and believe the transition will be smooth. With current staking at 65%, validators would still receive competitive returns, and the formula includes safeguards when staking drops below 50%.",
          replies: [
            {
              id: "c1r2r1",
              author: "anatoly",
              authorAvatar: "",
              date: "Jan 18, 2025",
              content: "That makes sense. I appreciate the thoughtful approach to ensuring network security is maintained.",
              reactions: [
                { emoji: "👍", count: 8 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "c2",
      author: "validator_operator",
      authorAvatar: "",
      date: "Jan 18, 2025",
      content: "As a validator operator, I'm concerned about how this might affect our economics. The current fixed rate provides predictability for our operations.",
      replies: [
        {
          id: "c2r1",
          author: "tusharjain",
          authorAvatar: "",
          date: "Jan 18, 2025",
          content: "That's a valid concern. The formula is designed to be predictable based on staking participation, which changes relatively slowly. Additionally, as MEV revenue continues to grow, it should offset any reduction in inflation rewards.",
          reactions: [
            { emoji: "👍", count: 12 }
          ]
        },
        {
          id: "c2r2",
          author: "validator_operator",
          authorAvatar: "",
          date: "Jan 19, 2025",
          content: "Thanks for addressing this. I'm still a bit concerned, but I understand the rationale.",
          reactions: [
            { emoji: "👍", count: 3 }
          ]
        }
      ]
    },
    {
      id: "c3",
      author: "defi_developer",
      authorAvatar: "",
      date: "Jan 19, 2025",
      content: "This is great for DeFi! Lower 'risk-free' staking rates would encourage more SOL to be used in DeFi protocols rather than just being staked.",
      reactions: [
        { emoji: "👍", count: 28 },
        { emoji: "🔥", count: 15 }
      ]
    },
    {
      id: "c4",
      author: "technical_reviewer",
      authorAvatar: "",
      date: "Jan 20, 2025",
      isApproval: true,
      content: "I've reviewed the technical implementation and the math checks out. The formula provides a smooth curve that responds appropriately to changes in staking participation. The constant c ≈ π is an elegant choice that makes the formula behave well at the critical 33% and 50% thresholds.",
      reactions: [
        { emoji: "👍", count: 19 }
      ]
    },
    {
      id: "c5",
      author: "economic_researcher",
      authorAvatar: "",
      date: "Jan 21, 2025",
      content: "I've analyzed the economic implications of this proposal. The dynamic adjustment based on staking participation creates a natural equilibrium that should optimize network security while minimizing unnecessary inflation. This is a significant improvement over the current fixed schedule.",
      reactions: [
        { emoji: "👍", count: 23 },
        { emoji: "🧠", count: 11 }
      ],
      replies: [
        {
          id: "c5r1",
          author: "community_member",
          authorAvatar: "",
          date: "Jan 21, 2025",
          content: "Could you share more details about your analysis? I'm particularly interested in how this might affect SOL price in the medium to long term.",
          reactions: [
            { emoji: "👍", count: 7 }
          ]
        },
        {
          id: "c5r2",
          author: "economic_researcher",
          authorAvatar: "",
          date: "Jan 22, 2025",
          content: "While I can't make price predictions, reducing unnecessary inflation should decrease selling pressure over time. Validators often sell a portion of rewards to cover operational costs and taxes, so a more efficient emission mechanism could reduce this selling pressure while maintaining network security.",
          reactions: [
            { emoji: "👍", count: 14 },
            { emoji: "💯", count: 6 }
          ]
        }
      ]
    },
    {
      id: "c6",
      author: "governance_specialist",
      authorAvatar: "",
      date: "Jan 23, 2025",
      content: "This proposal represents a significant change to Solana's monetary policy. I recommend we have a formal governance vote before implementation to ensure broad community support.",
      reactions: [
        { emoji: "👍", count: 31 }
      ],
      replies: [
        {
          id: "c6r1",
          author: "tusharjain",
          authorAvatar: "",
          date: "Jan 23, 2025",
          content: "Agreed. Once we've gathered feedback and refined the proposal based on community input, we should proceed with a formal governance vote.",
          reactions: [
            { emoji: "👍", count: 18 }
          ]
        }
      ]
    },
    {
      id: "c7",
      author: "protocol_engineer",
      authorAvatar: "",
      date: "Feb 5, 2025",
      content: "I've been running simulations on this proposal and the results are promising. The formula creates a nice balance between security incentives and minimizing unnecessary inflation. I'm particularly impressed with how it handles the edge cases when staking participation drops below 50%.",
      reactions: [
        { emoji: "👍", count: 25 },
        { emoji: "🧪", count: 12 }
      ]
    },
    {
      id: "c8",
      author: "community_member",
      authorAvatar: "",
      date: "Feb 10, 2025",
      content: "Has there been any consideration for how this might affect liquid staking protocols? They've become a significant part of the ecosystem.",
      reactions: [
        { emoji: "👍", count: 19 },
        { emoji: "🤔", count: 8 }
      ],
      replies: [
        {
          id: "c8r1",
          author: "tusharjain",
          authorAvatar: "",
          date: "Feb 11, 2025",
          content: "Great question. Liquid staking protocols should adapt well to this change. They'll continue to receive staking rewards based on the new formula, and their users will still benefit from the liquidity they provide. If anything, this change might make liquid staking even more attractive as it optimizes the balance between staking and DeFi usage.",
          reactions: [
            { emoji: "👍", count: 22 }
          ]
        }
      ]
    },
    {
      id: "c9",
      author: "core_dev",
      authorAvatar: "",
      date: "Feb 15, 2025",
      content: "I've reviewed the implementation PR and everything looks good from a technical perspective. The transition plan with the 10-epoch interpolation is a nice touch to ensure a smooth changeover.",
      isApproval: true,
      reactions: [
        { emoji: "👍", count: 27 },
        { emoji: "🚀", count: 14 }
      ]
    },
    {
      id: "c10",
      author: "foundation_member",
      authorAvatar: "",
      date: "Feb 20, 2025",
      content: "The Foundation is supportive of this proposal. We believe it aligns well with Solana's long-term vision of creating an efficient, market-driven ecosystem. We'll be scheduling a community call to discuss this further and gather additional feedback.",
      reactions: [
        { emoji: "👍", count: 35 },
        { emoji: "🎉", count: 18 }
      ]
    },
    {
      id: "c11",
      author: "defi_protocol_founder",
      authorAvatar: "",
      date: "Feb 25, 2025",
      content: "As a DeFi protocol founder, I'm excited about this change. Lower 'risk-free' rates from staking will make DeFi yields more competitive and should drive more liquidity into the ecosystem. This is a win-win for both validators and DeFi protocols.",
      reactions: [
        { emoji: "👍", count: 29 },
        { emoji: "💰", count: 15 }
      ]
    },
    {
      id: "c12",
      author: "validator_coalition",
      authorAvatar: "",
      date: "Mar 1, 2025",
      content: "After discussing with our validator coalition, we're supportive of this proposal. The formula provides adequate returns for validators while optimizing network efficiency. The safeguards for low staking participation are particularly important for ensuring network security is maintained.",
      reactions: [
        { emoji: "👍", count: 42 },
        { emoji: "🔒", count: 19 }
      ]
    },
    {
      id: "c13",
      author: "governance_specialist",
      authorAvatar: "",
      date: "Mar 5, 2025",
      content: "We've scheduled a formal governance vote for March 15th. The proposal will be presented with all the technical details and economic analysis. I encourage everyone to participate in the vote to ensure broad community representation.",
      reactions: [
        { emoji: "👍", count: 38 },
        { emoji: "🗳️", count: 22 }
      ]
    },
    {
      id: "c14",
      author: "tusharjain",
      authorAvatar: "",
      date: "Mar 10, 2025",
      content: "Thank you all for the thoughtful feedback and support. We've incorporated many of your suggestions into the final proposal. I'm confident this change will benefit the entire Solana ecosystem by creating a more efficient, market-driven emission mechanism that balances security with minimizing unnecessary inflation.",
      reactions: [
        { emoji: "👍", count: 45 },
        { emoji: "🙏", count: 27 },
        { emoji: "❤️", count: 19 }
      ]
    }
  ]
};