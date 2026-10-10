/* English version of the ready-made reviews. Same ids and order as content.js. */
window.SITE_EN = {
  topics: [
    {
      id: "ai",
      name: "AI startups",
      intro: "Products where AI does the main work and the person pays for a finished result. The key here: a narrow task and a clear customer.",
      ideas: [
        {
          title: "Replies to reviews for local businesses",
          verdict: "Go for it if you can find 5 venues to test with",
          scores: { demand: 4, ease: 4, space: 2 },
          what: "The service reads a review of a cafe, clinic or salon and writes a polite reply in the venue's tone. For negative reviews it suggests how to fix the situation.",
          money: "A subscription per venue. A free first month helps you get your first case study.",
          risks: "Maps and listing platforms may add this feature themselves. Owners do not pay until they see that replies bring customers.",
          steps: [
            "Take 20 real reviews and write replies to them by hand with an AI chatbot.",
            "Show the result to five venue owners and ask how much they would pay.",
            "Build a simple bot: paste a review, get a reply.",
            "Give two venues a free month in exchange for an honest review.",
            "Count how much time per week the bot saves them."
          ]
        },
        {
          title: "Plain-language review of contracts and documents",
          verdict: "Huge demand, but it will not fly without accuracy",
          scores: { demand: 5, ease: 3, space: 3 },
          what: "A person pastes a rental contract, a tax letter or loan terms. The service explains what it means, where the catch is and which questions to ask.",
          money: "Pay per review or a subscription. After swapping local rules it works in any country.",
          risks: "A mistake can cost the user a lot. It needs a clear note that this is not legal advice, and it must rely on real law texts, not on the model's memory.",
          steps: [
            "Pick one document type, for example an apartment rental contract.",
            "Collect 10 typical traps from open sources and check them against the law or with a lawyer.",
            "Do the review on these 10 examples by hand.",
            "Show it to people who recently rented a place and ask what became clearer.",
            "Automate only after that."
          ]
        },
        {
          title: "An AI assistant for one narrow profession",
          verdict: "A modest audience, but a strong product",
          scores: { demand: 3, ease: 4, space: 4 },
          what: "Not an assistant for everyone, but a tool for, say, tutors: lesson plans, messages to parents, student progress reports.",
          money: "A small monthly subscription from each specialist.",
          risks: "A small audience caps growth. You will have to learn someone else's profession in depth.",
          steps: [
            "Pick a profession and talk to three people from it.",
            "Find out which single task they dislike the most.",
            "Build only that task, but do it very well.",
            "Ask them to bring in colleagues.",
            "When it works, take the neighbouring profession."
          ]
        }
      ]
    },
    {
      id: "marketplaces",
      name: "Marketplaces",
      intro: "Marketplace sellers count every penny and every review. They quickly pay for what saves time or raises profit.",
      ideas: [
        {
          title: "Product listings that follow platform rules",
          verdict: "A crowded market; accuracy for a category wins",
          scores: { demand: 4, ease: 4, space: 2 },
          what: "The seller enters a product and its specs, and the service writes the title, description and keywords according to the platform's requirements.",
          money: "A subscription or payment per pack of listings.",
          risks: "Big services already do this, and platforms are adding AI features themselves. Platform rules change often.",
          steps: [
            "Pick one category, for example home goods.",
            "Study the best listings in it and note what they have in common.",
            "Make a description template for this category.",
            "Offer ten sellers to rewrite one listing each for free.",
            "Compare whether the listings started to show up and sell better."
          ]
        },
        {
          title: "A real-profit calculator per product",
          verdict: "The clearest benefit: the person sees their own money",
          scores: { demand: 5, ease: 3, space: 3 },
          what: "The seller enters purchase cost, commission, logistics, storage and share of returns. The service shows the true margin and the price below which selling makes no sense.",
          money: "A free calculator attracts sellers; paid features add saving calculations and product comparison.",
          risks: "Platform fees change, so the calculator needs constant updates. Outdated numbers are worse than none.",
          steps: [
            "List all of a seller's cost items from the platform's official pages.",
            "Build a simple calculation table and test it on three real products.",
            "Ask sellers to compare the result with their real numbers.",
            "Turn the calculation into a web page.",
            "Add saving of calculations."
          ]
        },
        {
          title: "Choosing a product niche by demand",
          verdict: "Sounds tempting, but it does not work without data",
          scores: { demand: 4, ease: 2, space: 2 },
          what: "The service suggests which products to start selling based on demand and competition.",
          money: "A subscription to niche reports.",
          risks: "Good demand data is closed or paid. Without it, recommendations turn into guesses, which hurts sellers.",
          steps: [
            "Find out which demand data is openly and legally available.",
            "If there is no honest data, postpone the idea.",
            "Test on one category whether the conclusions match the real sales of sellers you know.",
            "Build the product only if they match."
          ]
        }
      ]
    },
    {
      id: "services",
      name: "Online services",
      intro: "People sell their time and skills. Ideas work here when they save the provider's own time or help someone start from zero.",
      ideas: [
        {
          title: "Templates for proposals and client replies",
          verdict: "Simple and fast, but you will have to stand out by quality",
          scores: { demand: 4, ease: 5, space: 2 },
          what: "A freelancer describes a job, and the service writes a proposal, a reply to \"too expensive\" and a reminder about an unpaid invoice.",
          money: "A small subscription or paid template packs.",
          risks: "Any free chatbot can do this. The value is only in ready-made scenarios and convenience.",
          steps: [
            "Collect 15 typical freelancer situations.",
            "Write the best reply for each.",
            "Ask three freelancers which situations are the most unpleasant.",
            "Pack it all into a simple page with a situation picker.",
            "Add tuning for a niche: design, copywriting, development."
          ]
        },
        {
          title: "A turnkey mini-site and booking bot for small business",
          verdict: "Good for first money, bad for growth",
          scores: { demand: 4, ease: 3, space: 3 },
          what: "A fixed package for a craftsperson or small studio: a page with prices and a bot that answers customers and takes bookings.",
          money: "A one-time setup fee and a small monthly support fee.",
          risks: "This is a service, not a product: more customers means more manual work. Contracts and payments need an adult.",
          steps: [
            "Build the template once.",
            "Find five craftspeople from the same field.",
            "Set it all up for them for free or for a small fee.",
            "Collect reviews and photos of the result.",
            "Decide whether to turn it into a product that configures itself."
          ]
        },
        {
          title: "Finding a first side job by skills",
          verdict: "Useful for people, but harder to earn from yourself",
          scores: { demand: 4, ease: 4, space: 3 },
          what: "A person answers what they can do and how much time they have. The service suggests real ways to earn first money and prepares the first steps.",
          money: "Paid extended plans or affiliate links to job boards.",
          risks: "There is a lot of junk content about easy money. Trust is built only on honesty: do not promise income that does not exist.",
          steps: [
            "Make a list of 20 ways to earn with an honest description of how to get in.",
            "Check each one: can you really start with no money?",
            "Build a questionnaire of five questions.",
            "Ask friends to take it and say what turned out useful.",
            "Do not write income figures you cannot confirm."
          ]
        }
      ]
    },
    {
      id: "content",
      name: "Content and blogs",
      intro: "Content is the cheapest way to start: you only need time and consistency. Money comes later, after an audience.",
      ideas: [
        {
          title: "A content plan and ideas for an author's niche",
          verdict: "High competition, you need a narrow niche",
          scores: { demand: 4, ease: 5, space: 2 },
          what: "The author names the channel topic, and the service suggests episode ideas for the month, headlines and a publishing plan.",
          money: "A subscription for authors.",
          risks: "General idea generators already exist. You need a narrow niche where the ideas are truly better than generic ones.",
          steps: [
            "Pick a niche, for example gaming creators or money creators.",
            "Study what works best for them.",
            "Make a set of ideas for this niche by hand.",
            "Show it to five authors and ask whether they would take at least one idea.",
            "Add headlines and descriptions."
          ]
        },
        {
          title: "Public experiments: I test an idea in a week",
          verdict: "The best start for you: benefit and content at once",
          scores: { demand: 3, ease: 5, space: 3 },
          what: "The author takes a real business idea, tests it step by step and honestly publishes the result, including failures.",
          money: "None at first: audience and trust grow. Later ads, affiliate links and paid reviews.",
          risks: "Slow growth. If you make up results, trust is gone for good.",
          steps: [
            "Pick one idea you will really test.",
            "Write down in advance how you will know it worked.",
            "Test it for a week and record the numbers.",
            "Publish the result without sugar-coating.",
            "Repeat every week."
          ]
        },
        {
          title: "A weekly newsletter: one idea, one review",
          verdict: "A simple mechanic that builds an audience",
          scores: { demand: 3, ease: 5, space: 3 },
          what: "Once a week, an email with one business idea, its review and a first step that can be done in a day.",
          money: "Ads, affiliate links, a paid version with deeper reviews.",
          risks: "It needs regularity. Without a steady flow of subscribers a newsletter quietly dies.",
          steps: [
            "Prepare five issues in advance.",
            "Publish the first one on the site.",
            "Add a subscription form.",
            "Write only about what you have tested yourself.",
            "Watch which issues get opened more often."
          ]
        }
      ]
    },
    {
      id: "education",
      name: "Education",
      intro: "The biggest audience and the biggest competition. The winners are not \"one more tutor\" but a clear tool for a specific subject.",
      ideas: [
        {
          title: "A helper that leads to the answer instead of giving it",
          verdict: "A strong idea, but hard to do properly",
          scores: { demand: 5, ease: 3, space: 2 },
          what: "A student pastes a problem, and instead of a ready solution the service asks guiding questions and checks the steps.",
          money: "A subscription for parents or schools.",
          risks: "Big services and school platforms are heading the same way. Students want quick answers, not questions.",
          steps: [
            "Pick one subject and one grade.",
            "Take 20 typical problems.",
            "Write a chain of guiding questions for each by hand.",
            "Test on three classmates: did they understand better?",
            "Automate only what worked."
          ]
        },
        {
          title: "An exam question trainer for one subject",
          verdict: "A clear benefit and a clear goal: pass",
          scores: { demand: 5, ease: 3, space: 2 },
          what: "The service generates practice questions on a topic, explains mistakes and shows weak spots.",
          money: "Paid access for the exam preparation period.",
          risks: "You must check that questions and answers are correct: a mistake in study material does harm. There are many competitors.",
          steps: [
            "Pick one exam and one topic.",
            "Collect 30 questions from open sources.",
            "Check correctness against the textbook.",
            "Build a simple page with a quiz.",
            "Add an explanation for each mistake."
          ]
        },
        {
          title: "A helper for parents: how to explain a topic to a child",
          verdict: "A narrow audience with a real pain",
          scores: { demand: 3, ease: 4, space: 3 },
          what: "A parent enters a topic from the school curriculum, and the service explains it in simple language and gives examples for the child.",
          money: "A subscription for parents.",
          risks: "They pay reluctantly until the problem is sharp. It needs accurate explanations for each age.",
          steps: [
            "Pick one grade.",
            "Ask five parents which topics cause the most questions.",
            "Make explanations for three topics.",
            "Show them to parents and ask whether it helped.",
            "Add the next topics."
          ]
        }
      ]
    },
    {
      id: "money",
      name: "Personal finance",
      intro: "Everyone needs money, and school barely covers it. The key here is honesty: teach and calculate, do not promise quick earnings.",
      ideas: [
        {
          title: "A money mentor for teens and students",
          verdict: "The option closest to you, and a huge audience",
          scores: { demand: 4, ease: 4, space: 3 },
          what: "Helps set a saving goal, calculates how much to put aside, and explains interest, inflation and tax on a first side job in simple words.",
          money: "A free version grows the audience; paid extended features or partner materials bring income.",
          risks: "You must not advise where to invest money: that is a responsibility and in some countries a licensed activity. Only education and calculations.",
          steps: [
            "Pick three topics: saving for a goal, a first side job, how not to fall for scams.",
            "Write a simple explanation with a worked example for each.",
            "Build a savings calculator.",
            "Show it to ten peers and find out what stayed unclear.",
            "Add warnings about typical traps."
          ]
        },
        {
          title: "A review of subscriptions and recurring payments",
          verdict: "It shows savings in money, and that sells",
          scores: { demand: 4, ease: 3, space: 3 },
          what: "A person uploads a list of payments, and the service finds forgotten subscriptions and overpayments and writes a message to the provider asking to lower the price.",
          money: "You can charge for the result: a percentage of the found savings or a fixed fee.",
          risks: "Bank data is sensitive. It is better to ask users to remove card numbers and names, or to process everything on the user's device.",
          steps: [
            "Make a list of typical subscriptions and how to cancel them.",
            "By hand, review three real statements from friends, with their consent and without personal data.",
            "Count how much was saved.",
            "Think through how to store data safely.",
            "Build the service only after that."
          ]
        },
        {
          title: "A \"how much does my idea cost\" calculator",
          verdict: "A simple tool you can start tomorrow",
          scores: { demand: 3, ease: 5, space: 3 },
          what: "A person describes a mini project, for example selling stickers, and the service calculates costs, price, profit and break-even point.",
          money: "A free calculator brings people to the site; paid saving and templates bring income.",
          risks: "Simple calculators are easy to copy. The value is in hints: which costs people usually forget.",
          steps: [
            "List the costs beginners forget.",
            "Build a form with these fields.",
            "Add price and break-even calculation.",
            "Test on three real mini projects of people you know.",
            "Add templates for popular projects."
          ]
        }
      ]
    }
  ]
};
