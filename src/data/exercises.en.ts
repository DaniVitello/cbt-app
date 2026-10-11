import type { Exercise } from "../types/exercise";

export const exercisesEn: Exercise[] = [
  {
    id: "problem-solving",
    version: 1,
    category: "action",
    intents: ["action"],
    help: {
      purpose:
        "Helps you sort out a concrete problem: define it head-on, set a goal, look at what you've tried so far and what came of it, so you can then decide on a next step with more clarity.",
      example:
        "E.g.: Problem: 'I can't concentrate to study at night'. Goal: 'Study 2 hours straight'. Tried: leaving my phone in another room (worked halfway). Result: I studied an hour and a half and got restless.",
    },
    title: "Problem solving: Self-monitoring form",
    description:
      "Answering the following questions gives the therapist the information they need about the client's general and specific problem-solving approaches and reactions. Fill in the following:",
    sections: [
      {
        id: "problem",
        title: "Describe the problem you're facing",
        fields: [
          {
            type: "text",
            id: "problem-description",
            label: "What is the situation, who is involved, and where? Why is it a problem for you?",
            placeholder: "Describe the problem in detail.",
          },
        ],
      },
      {
        id: "goal",
        title: "What is your goal?",
        fields: [
          {
            type: "text",
            id: "goal-description",
            label: "What would you like to happen?",
            placeholder: "Write what the desired outcome would be.",
          },
        ],
      },
      {
        id: "attempts",
        title: "What have you tried so far to solve the problem?",
        fields: [
          {
            type: "text",
            id: "attempts-description",
            label: "Be specific and describe your thoughts and actions as you tried to solve the problem.",
            placeholder: "Write what things you tried to solve the problem.",
          },
        ],
      },
      {
        id: "outcome",
        title: "What was the outcome?",
        fields: [
          {
            type: "text",
            id: "outcome-description",
            label: "What happened when you tried to solve the problem? How did you react emotionally? How satisfied were you with the result?",
            placeholder: "Write what happened and how you felt about the result.",
          },
        ],
      },
    ],
  },
  {
    id: "decatastrophizing",
    version: 1,
    category: "anxiety",
    intents: ["now", "belief"],
    measure: {
      id: "catastrophe-likelihood",
      labelBefore: "Before you start: how much do you believe the catastrophe will happen?",
      labelAfter: "Now that you're done: how much do you believe the catastrophe will happen?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "For toning down a 'what if everything goes wrong' thought. You'll put the fear into precise words, look at the real probability, and see that even if the worst happens, you could handle it.",
      example:
        "E.g.: Instead of 'What if I do badly in the interview?', write the concrete prediction: 'I won't get the job'. Then rate how likely it is, not how terrible it sounds.",
    },
    title: "Decatastrophizing",
    accepts: [{ kind: "situation", intoFieldId: "catastrophe-description" }],
    outputs: [{ fieldId: "catastrophe-description", kind: "belief" }],
    next: ["behavioral-experiments"],
    description:
      "Use this decatastrophizing worksheet to help yourself cognitively restructure when you feel you're getting overwhelmed by catastrophic thoughts. 'Decatastrophizing' is about exploring the reality and facts of a situation instead of getting carried away by 'What if...?' thoughts. This sheet has 5 boxes to fill in. Start at the top, where you'll find a space to clearly identify the catastrophe that's bothering you. State exactly what you have in mind, before rating how distressing the hypothetical scenario would be on a scale from 0% (not bad at all) to 100% (absolutely terrible).",
    sections: [
      {
        id: "catastrophe",
        title: "1. What 'catastrophe' is bothering you?",
        fields: [
          {
            type: "text",
            id: "catastrophe-description",
            label: "Specify what you imagine will happen, avoiding 'What if...?' statements. Instead, rephrase them as precise predictions, e.g. 'I won't get the job'.",
            placeholder: "Write the catastrophe precisely, without using 'What if...?'",
          },
          {
            type: "rating",
            id: "catastrophe-rating",
            label: "Rate how terrible you think it would be from 0% to 100%",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "likelihood",
        title: "2. What is the probability that the catastrophe happens?",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "In the past, has this happened before? How often does this happen in real life?",
            placeholder: "Objectively consider whether the feared scenario happened before and how often it happens in real life.",
          },
        ],
      },
      {
        id: "impact",
        title: "3. How terrible would it be if your catastrophe actually happened?",
        fields: [
          {
            type: "text",
            id: "worst-case",
            label: "What would be the worst possible outcomes?",
            placeholder: "Imagine it already happened. What would be the worst outcomes?",
          },
          {
            type: "text",
            id: "best-case",
            label: "What would be the best possible outcomes?",
            placeholder: "What would be the best possible outcomes?",
          },
          {
            type: "text",
            id: "friend-perspective",
            label: "How would a friend talk to you about your worry?",
            placeholder: "Think about how a friend would talk to you about your worry.",
          },
        ],
      },
      {
        id: "coping",
        title: "4. If the worst possible scenario happened, how would you cope?",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "What have you done in similar past situations? What techniques, strategies or people could you turn to?",
            placeholder: "Think about similar past experiences and what resources you could use to deal with the consequences.",
          },
        ],
      },
      {
        id: "reassurance",
        title: "5. What is the most reassuring or positive thing you'd like to hear?",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "What kind of things would you like to hear to feel better? What would reassure you, and what would it sound like?",
            placeholder: "Write what you'd like to hear to feel better and what it would sound like.",
          },
          {
            type: "rating",
            id: "reassurance-rating",
            label: "Now, how terrible do you think it would be from 0% to 100%?",
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  },
  {
    id: "rabbit-hole",
    version: 1,
    category: "anxiety",
    intents: ["now"],
    help: {
      purpose:
        "Cuts the 'what if...?' spiral: for every negative outcome that worries you, it forces you to find an equally plausible positive one.",
      example:
        "E.g.: Negative: 'If I'm late, I'll get fired'. Positive: 'If I'm late, I'll message ahead and everything turns out fine'.",
    },
    title: "How to deal with anxiety: Reverse the rabbit hole",
    description:
      "If you struggle with anxiety, you know those two little words, 'what if...?', can send your mind down a rabbit hole of increasingly negative scenarios. A single question can take you from wondering how something will turn out to being sure it will become the worst possible scenario. To fight this pull toward the negative, try reversing the rabbit hole (that is, considering positive outcomes). For every negative outcome, there's a positive one that's just as likely. Use this worksheet to find some potential positive outcomes. Write down a negative outcome that worries you and find an equally plausible positive outcome.",
    sections: [
      {
        id: "outcomes",
        title: "Outcomes",
        fields: [
          {
            type: "rows",
            id: "outcomes-table",
            label: "Write a negative outcome that worries you and find an equally plausible positive outcome",
            columns: [
              {
                type: "text",
                id: "negative",
                label: "Negative outcome",
              },
              {
                type: "text",
                id: "positive",
                label: "Positive outcome",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "core-beliefs-suitcases",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    measure: {
      id: "core-belief-strength",
      labelBefore: "Before: how much do you believe the belief you want to challenge?",
      labelAfter: "Now: how much do you believe that belief?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "Helps you identify deep beliefs about yourself (the three 'suitcases' you'd pick for an interview) and find concrete reasons why each one might not be true.",
      example:
        "E.g.: Belief: 'I'm not talented'. Reasons: 'They asked me to train someone new', 'I finished that hard project', 'My boss congratulated me in March'.",
    },
    title: "Core beliefs: The suitcases",
    accepts: [{ kind: "belief", intoFieldId: "belief" }],
    outputs: [{ fieldId: "belief", kind: "belief" }],
    next: ["disputing-irrational-beliefs"],
    description:
      "Core beliefs relate to the most deeply rooted representations we have of ourselves, of others, of the present and the future. The following example shows how, in any scenario, our core beliefs can impact our behavior. Scenario: imagine yourself going to a job interview and wondering whether you deserve this role: one you really want. Today, you need to pick a suitcase to take with you. Each one represents a core belief. Use the thought bubbles to identify three core beliefs you'd like to challenge. In the spaces next to these, try to find three reasons why these beliefs aren't true.",
    sections: [
      {
        id: "beliefs",
        title: "Your core beliefs",
        fields: [
          {
            type: "group",
            id: "core-beliefs",
            label: "Identify three core beliefs you'd like to challenge and find three reasons why each one might not be true",
            groups: [
              {
                id: "belief-1",
                label: "Core belief 1",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "The core belief",
                    placeholder: "E.g. 'I'm not talented'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "This can't be true because... (reason 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "This can't be true because... (reason 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "This can't be true because... (reason 3)",
                  },
                ],
              },
              {
                id: "belief-2",
                label: "Core belief 2",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "The core belief",
                    placeholder: "E.g. 'I'm not sure I'm talented'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "This can't be true because... (reason 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "This can't be true because... (reason 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "This can't be true because... (reason 3)",
                  },
                ],
              },
              {
                id: "belief-3",
                label: "Core belief 3",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "The core belief",
                    placeholder: "E.g. 'I'm not talented'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "This can't be true because... (reason 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "This can't be true because... (reason 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "This can't be true because... (reason 3)",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "i-will-survive",
    version: 1,
    category: "selfcare",
    intents: ["relax"],
    help: {
      purpose:
        "To remind you of your resources: something hard already happened, and here you review what you did, what helped, and who was there. It's a backup when a new challenge shows up.",
      example:
        "E.g.: 'When I moved out on my own with no money, making a budget helped, my sister lent me money, and I found out I hold up better than I thought.'",
    },
    title: "I will survive",
    description:
      "This exercise is designed to help you evaluate your own coping skills, as well as the social support systems you rely on to deal with life's setbacks and difficulties. Self-compassion and self-love have been linked to our ability to thrive in the face of difficult circumstances. When dealing with challenging situations, a self-compassionate approach often serves as a protective buffer, helping us deal with our inner critic, preparing us to cope more adaptively, and helping us get through. By considering the internal and external resources that help you deal with struggles and problems, you can start to identify your own protective buffers, from your personal traits to the people around you who could help. This sheet contains three questions for you to reflect on and answer. Write your answers in the space provided, where you can come back to them later or when you're going through a challenge.",
    sections: [
      {
        id: "challenge",
        title: "Part 1: A personal challenge",
        fields: [
          {
            type: "text",
            id: "challenge-description",
            label: "Reflect on a very difficult experience you've had in your life. Write freely about this experience in the space provided. Try to tell what happened, how you felt, and what was hard for you to handle, with as much detail as you want. Don't worry about spelling or grammar.",
            placeholder: "Write about a difficult experience you've been through.",
          },
        ],
      },
      {
        id: "coping",
        title: "Part 2: Your coping skills",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "Now consider what you did to survive that challenging time. What actions did you take? What internal and external resources did you use? What kind of help did you seek out? What helped you survive or get through your difficulties? What didn't? What strengths helped you get through that moment? What abilities or personal traits were especially useful? What skills are you proud of having put into practice? How did they help you?",
            placeholder: "Think about what you did to survive and what resources you used.",
          },
        ],
      },
      {
        id: "supports",
        title: "Part 3: Your social supports",
        fields: [
          {
            type: "text",
            id: "supports-description",
            label: "Consider a meaningful goal, wish, or ambition you have. Write about it in the space provided. Now think of a past compliment you've received related to this goal or wish. Who gave it to you? Did they highlight any particular strength, trait, or ability? Did a coworker, mentor, family member, or friend express admiration for certain abilities?",
            placeholder: "Think about people who supported you and compliments you've received.",
          },
        ],
      },
    ],
  },
  {
    id: "cognitive-restructuring",
    version: 1,
    category: "thoughts",
    intents: ["belief", "now"],
    measure: {
      id: "thought-strength",
      labelBefore: "Before: how much do you believe the harshest thought about the event?",
      labelAfter: "Now: how much do you believe that thought?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "Takes you to look at an event that already happened and replace the harshest thought with a more balanced view, or with accepting what happened.",
      example:
        "E.g.: Event: 'I interrupted in the meeting'. Thought: 'I came off as an ignoramus'. Restructuring: 'I got excited about the topic and chimed in; that's valued too'.",
    },
    title: "Cognitive restructuring of an event",
    accepts: [{ kind: "thought", intoFieldId: "thoughts-description" }],
    description:
      "When things have already happened, especially when the outcome wasn't what we expected, we can end up thinking the worst about ourselves or about what happened. Cognitive restructuring is a process that helps reshape cognition. After all, it's the belief or thought related to the event, and not the event itself, that affects a person the most. Work through the following steps to restructure your thoughts about an event, giving it a positive frame or accepting what happened.",
    sections: [
      {
        id: "event",
        title: "What was the event?",
        fields: [
          {
            type: "text",
            id: "event-description",
            label: "What event would you like to restructure?",
            placeholder: "An event that already happened and is still affecting you.",
          },
        ],
      },
      {
        id: "thoughts",
        title: "What are your thoughts about the event?",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "What thoughts do you have about that event?",
            placeholder: "What do you tell yourself about what happened?",
          },
        ],
      },
      {
        id: "restructure",
        title: "How can you cognitively restructure those thoughts?",
        fields: [
          {
            type: "text",
            id: "restructure-description",
            label: "How could you restructure those thoughts in a more realistic way?",
            placeholder: "Look for a more balanced and compassionate interpretation.",
          },
        ],
      },
    ],
  },
  {
    id: "behavioral-experiments",
    version: 1,
    category: "action",
    intents: ["action", "belief"],
    help: {
      purpose:
        "Turns a belief into something you can test in real life: you write it down, derive an alternative belief, set up an experiment, run it, and compare what happened against what you expected.",
      example:
        "E.g.: Belief: 'If I ask for help, people will see me as less capable'. Experiment: ask a coworker to review my report. Result: they reviewed it and told me the analysis was good.",
    },
    title: "Behavioral experiments to put beliefs to the test",
    accepts: [{ kind: "belief", intoFieldId: "original-belief" }],
    description:
      "A behavioral experiment is a CBT technique that involves testing negative automatic thoughts and reevaluating underlying beliefs and assumptions. This technique invites people to look at negative thoughts objectively rather than as absolute truths. First, a belief you want to test is identified. Then a specific hypothesis is derived from this general rule, and an experiment is designed to test that hypothesis.",
    sections: [
      {
        id: "belief",
        title: "Step 1: The original dysfunctional belief",
        fields: [
          {
            type: "text",
            id: "original-belief",
            label: "What is the original dysfunctional belief you want to test?",
            placeholder: "E.g. 'I can't enjoy my life being single'",
          },
          {
            type: "rating",
            id: "original-belief-rating",
            label: "How strongly do you believe this is going to happen? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "hypothesis",
        title: "Step 2: The hypothesis and the alternative belief",
        fields: [
          {
            type: "text",
            id: "alternative-belief",
            label: "Derive a hypothesis from this belief to arrive at an alternative belief. What is it?",
            placeholder: "E.g. 'I can enjoy some things being single'",
          },
          {
            type: "rating",
            id: "alternative-belief-rating",
            label: "How strongly do you believe this is going to happen? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "experiment",
        title: "Step 3: Design an experiment",
        fields: [
          {
            type: "text",
            id: "experiment-description",
            label: "What circumstances need to come about to test your hypothesis? Where would you have to go? What would you have to do or observe?",
            placeholder: "Design an experiment to test the alternative belief.",
          },
        ],
      },
      {
        id: "carrying-out",
        title: "Step 4: Carry out the experiment",
        fields: [
          {
            type: "text",
            id: "carrying-out-description",
            label: "What happened when you carried out the experiment?",
            placeholder: "Write what happened when you put the experiment into practice.",
          },
        ],
      },
      {
        id: "observations",
        title: "Step 5: Record your observations",
        fields: [
          {
            type: "text",
            id: "observations-description",
            label: "What did you observe during the experiment?",
            placeholder: "Write what you observed when you carried out the experiment.",
          },
        ],
      },
      {
        id: "reflection",
        title: "Step 6: Reflect on the observations",
        fields: [
          {
            type: "text",
            id: "reflection-description",
            label: "How did the dysfunctional belief hold up against the alternative belief?",
            placeholder: "Reflect on how the original belief held up against the alternative one.",
          },
          {
            type: "rating",
            id: "results-rating",
            label: "Now, how strongly do you believe the original belief? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  },
  {
    id: "thought-record",
    version: 1,
    category: "thoughts",
    intents: ["now", "belief"],
    help: {
      purpose:
        "To slow down and understand what happened: the trigger, your automatic thoughts, the emotional intensity, and which thinking style got activated (all-or-nothing, personalization...), and try an alternative.",
      example:
        "E.g.: Trigger: 'My friend didn't reply to my message'. Thought: 'I don't matter to them'. Alternative: 'They're at work; they'll probably reply later'.",
    },
    title: "Thought record (Cognitive restructuring)",
    outputs: [{ fieldId: "thoughts-description", kind: "thought" }],
    next: ["cognitive-restructuring"],
    description:
      "When we adopt faulty thinking styles, it can be helpful to fill in a thought record and consider what kind of thinking is being triggered. Below is a list of faulty thinking styles: Self-blame: instead of seeing yourself as the victim, you believe you're responsible for the pain and happiness of everyone around you. Rigid thinking: we know we're right, but other people won't always agree. Personalization: believing that everything people say and do is somehow related to us. Blaming: other people, organizations, and the universe in general are to blame for our problems. Generalizing from the specific: drawing a general conclusion based on a single occurrence. Mind reading: we believe we 'know' what others think and why they act the way they do, even though they haven't told us. Magnification and filtering: we magnify negative emotions and filter out everything positive. Polarized thinking: we think of situations and people in all-or-nothing terms, e.g. good versus bad, pass versus fail. Catastrophizing: we expect the worst. Everything will go wrong and have the most significant impact. Work with the client to complete the following thought record and identify which thinking style is being applied.",
    sections: [
      {
        id: "pause",
        title: "1. Pause",
        fields: [
          {
            type: "text",
            id: "pause-description",
            label: "When your thought or behavior is out of proportion with what's happening, the first and most important thing is to stop. What did you notice that made you stop?",
            placeholder: "Write what made you stop.",
          },
        ],
      },
      {
        id: "trigger",
        title: "2. Identify and understand the trigger",
        fields: [
          {
            type: "text",
            id: "trigger-description",
            label: "Who or what was it? When did it happen? Where did it happen? Why did it happen?",
            placeholder: "It can be as simple as an abrupt comment or a look. Something caused a reaction out of proportion to the situation.",
          },
        ],
      },
      {
        id: "thoughts",
        title: "3. Notice your automatic thoughts",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "What were your first thoughts after the trigger?",
            placeholder: "What automatically came to mind?",
          },
        ],
      },
      {
        id: "emotions",
        title: "4. Identify your emotional response",
        fields: [
          {
            type: "text",
            id: "emotions-description",
            label: "What emotions are you feeling and how intense are they? Rate from 1 to 10",
            placeholder: "Sadness, anxiety, anger, shame...",
          },
          {
            type: "rating",
            id: "emotions-rating",
            label: "Emotional intensity (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
      {
        id: "alternative",
        title: "5. Replace with alternative thoughts",
        fields: [
          {
            type: "text",
            id: "alternative-description",
            label: "How could you reinterpret what happened in a more realistic way?",
            placeholder: "Look for a more balanced explanation.",
          },
        ],
      },
      {
        id: "rerating",
        title: "6. Re-rate the intensity of your emotional response",
        fields: [
          {
            type: "rating",
            id: "rerating",
            label: "What is your emotional intensity now? (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
    ],
  },
  {
    id: "downward-arrow",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    measure: {
      id: "thought-belief",
      labelBefore: "Before: how much do you believe this thought?",
      labelAfter: "Now: how much do you believe this thought?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "It's a chained Socratic question: each answer takes you one step deeper, until you reach the core belief that holds the thought up.",
      example:
        "E.g.: 'I failed the exam' → 'What does that mean about you?' → 'That I'm no good at this' → 'And what does that mean?' → 'That I'll never achieve anything'.",
    },
    title: "The downward arrow technique for core beliefs",
    outputs: [{ fieldId: "about-you-description", kind: "belief" }],
    next: ["core-beliefs-suitcases"],
    description:
      "'Core beliefs' are a person's enduring, fundamental beliefs about themselves, about others, and about the world around them. Core beliefs aren't always negative; however, the ones that are can be problematic. Core beliefs are characterized by a number of factors: they often develop early in life, as a result of childhood experience. However, they can change later in life, for example as a result of adult trauma. They can exist outside of awareness. They can show up through absolute statements and assumptions like 'the world is a bad place'. Because these beliefs are held deeply, at someone's 'core', a person may not be particularly aware of them. The downward arrow technique is a Socratic questioning method that can help identify problematic core beliefs. In step 3, pick one of the questions below to ask yourself: 1. What does this negative thought mean? 2. What does this negative thought mean about you? 3. What does this negative thought mean about others? 4. What does this negative thought mean about the world? 5. If this is true, why does it bother you? 6. If this is true, why is it so bad? 7. If this is true, what does it mean for your future?",
    sections: [
      {
        id: "situation",
        title: "Step 1: Identify a situation that triggers negative emotions in you",
        fields: [
          {
            type: "text",
            id: "situation-description",
            label: "What situation is triggering negative emotions in you?",
            placeholder: "E.g. A university exam that makes me anxious",
          },
        ],
      },
      {
        id: "thoughts",
        title: "Step 2: Write down what thoughts accompany this situation and your feelings",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "What thoughts accompany this situation and your feelings?",
            placeholder: "E.g. 'I'm definitely going to fail this exam'",
          },
        ],
      },
      {
        id: "meaning",
        title: "Step 3: What does this negative thought mean? (Or a question from the list)",
        fields: [
          {
            type: "text",
            id: "meaning-description",
            label: "What does this negative thought mean? Pick a question from the list and answer it.",
            placeholder: "E.g. 'My parents are going to be disappointed in me again, like always'",
          },
        ],
      },
      {
        id: "about-you",
        title: "Step 4: What does this negative thought mean about you?",
        fields: [
          {
            type: "text",
            id: "about-you-description",
            label: "What does this negative thought mean about you?",
            placeholder: "E.g. 'I'm a failure'",
          },
        ],
      },
    ],
  },
  {
    id: "pmr",
    version: 1,
    category: "selfcare",
    intents: ["relax"],
    help: {
      purpose:
        "A step-by-step script for releasing muscle tension. Use it when you're anxious, tense, or angry; with practice it gets easier and easier to enter that calm state.",
      example:
        "E.g.: Sitting with your eyes closed, take three deep breaths and move through your body from your feet to your head, tensing and releasing each area.",
    },
    title: "Progressive muscle relaxation: Easy basics",
    description:
      "This script covers the basics of Progressive Muscle Relaxation, keeping it simple for younger audiences. Progressive Muscle Relaxation (PMR) can be a useful technique for relaxing the physical tension we feel in response to stress, and it works by sequentially targeting different parts of the body. Read the script while working through the steps together if you like, explaining that PMR can help you feel better when you're anxious, tense, or angry. Alternatively, this can be an exercise kids want to do on their own. At the end, encourage kids to practice Progressive Muscle Relaxation regularly, so they can use it whenever they want to calm down, or even to fall asleep.",
    sections: [
      {
        id: "script",
        title: "The script",
        fields: [
          {
            type: "readonly",
            id: "pmr-script",
            label: "Progressive muscle relaxation",
            content: `Progressive muscle relaxation is a useful way to feel calmer when you're anxious, angry, stressed, or tense. It's a way to relax and switch off, clearing your head so you can think better. PMR is really useful because it's something you can do anywhere, and it's not easy for others to notice you're doing it. You can also do it for a short time, or take longer if you want. This technique works best when you're in a quiet place, alone, and you can even do it in bed at night to help you fall asleep.

With your back nice and straight, settle into a comfortable position, standing or sitting.

Now gently close your eyes.

Start with three deep, calm breaths through your nose. Feel the air coming in and going out. In and out. In... and out again.

First, bring your attention to your feet. Feel your toes relaxing... your heels... the sole of each foot... the side of each foot... just relaxing. They might feel like they're getting lighter, looser, even softer or weightless.

Relax into that!

Slowly, calmly, move your mind through your body. Feel your ankles relaxing and letting go. Then upward, to your calves, with each part of the body relaxing as you think about it.

Take all the time you want and move upward, thinking about and releasing the tension in:
- Ankles
- Calves
- Knees
- Thighs (front and back)
- Glutes
- Stomach
- Lower back
- Mid back
- Spine
- Upper back
- Chest and torso
- Shoulders
- Arms (front and back)
- Elbows
- Forearms (front and back)
- Wrists
- Hands and fingers
- Neck
- Lips and tongue
- Eyes
- Temples

If you have time, why not repeat the whole process, moving down from the top of your head to the tips of your toes?

PMR works best if you practice it regularly, with a calm and peaceful state of mind. This helps create a habit, and then it's even easier to use when you get angry, feel stressed, or get nervous.

It's often harder to deal properly with challenges when we're already upset. When we stop to relax and feel better first, making good decisions gets easier. That's where PMR can be super useful!`,
          },
        ],
      },
    ],
  },
  {
    id: "challenging-catastrophic",
    version: 1,
    category: "anxiety",
    intents: ["now", "belief"],
    measure: {
      id: "fear-likelihood",
      labelBefore: "Before: how much do you believe what you fear will happen?",
      labelAfter: "Now: how much do you believe what you fear will happen?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "Puts the 'the worst always happens' prophecy to the test: you look at the real probability, the different scenarios, and your coping ability, to arrive at a calmer view.",
      example:
        "E.g.: Event: 'My computer breaks before the deadline'. Probability: it happened to me once in 5 years. Best scenario: I fix it in 2 days; worst: I miss the deadline and recover it with an extension.",
    },
    title: "Challenging catastrophic thoughts",
    outputs: [{ fieldId: "event-description", kind: "situation" }],
    next: ["decatastrophizing"],
    description:
      "Believing the worst will always happen and magnifying its impact can be very harmful to your mental well-being. Work through the event by completing this exercise to understand the fear and find reassurance that the worst outcome isn't inevitable.",
    sections: [
      {
        id: "event",
        title: "What event worries you?",
        fields: [
          {
            type: "text",
            id: "event-description",
            label: "Name the event. What is it you're worried will happen?",
            placeholder: "Write what event is worrying you and what you fear will happen.",
          },
          {
            type: "rating",
            id: "awfulness-rating",
            label: "How terrible do you think it would be? (1-10, where 10 is unbearable)",
            min: 1,
            max: 10,
          },
        ],
      },
      {
        id: "likelihood",
        title: "What is the probability that this happens?",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "Has something similar happened before? Does it happen often? If not, what are you basing it on to think it could happen?",
            placeholder: "Consider whether something similar happened before, whether it happens often, or what makes you think it could happen.",
          },
        ],
      },
      {
        id: "scenarios",
        title: "Understand the scenarios",
        fields: [
          {
            type: "text",
            id: "best-case",
            label: "What is the best possible scenario? Why?",
            placeholder: "What's the best that could happen and why?",
          },
          {
            type: "text",
            id: "worst-case",
            label: "What is the worst possible scenario? Why?",
            placeholder: "What's the worst that could happen and why?",
          },
        ],
      },
      {
        id: "coping",
        title: "If the worst happens, what would you do?",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "If it happened before, how did you cope? Who or what could help you? What could you do to prepare? What skills do you already have that would help?",
            placeholder: "Think about how you handled it before, who could help you, what you could do to prepare, and what skills you already have.",
          },
        ],
      },
      {
        id: "reassurance",
        title: "What would you say to a friend in this situation?",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "How would you reassure someone in a similar situation? Do you know anyone who's been through something like this?",
            placeholder: "Think about what you'd say to a friend and whether you know anyone who's faced something similar.",
          },
        ],
      },
      {
        id: "reflection",
        title: "How do you feel about the event now?",
        fields: [
          {
            type: "text",
            id: "reflection-description",
            label: "What do you think now, having looked at the risk and your ability to cope with it?",
            placeholder: "Reflect on how you feel now that you've thought about the risk and your ability to handle it.",
          },
        ],
      },
    ],
  },
  {
    id: "dysfunctional-thought-record",
    version: 1,
    category: "thoughts",
    intents: ["now", "belief"],
    help: {
      purpose:
        "A 7-column table for logging recurring thoughts, their distortion, and an alternative, to figure out when and why they show up more.",
      example:
        "E.g.: 14:30, meeting with the boss; thought 'they're going to criticize me' (80%); emotion anxiety (70%); distortion: mind reading; alternative: 'they just want to check progress'; outcome: belief 40%.",
    },
    title: "Dysfunctional thought record",
    description:
      "This worksheet is especially useful for people who struggle with negative thoughts and need to figure out when and why those thoughts are more likely to show up. Learning more about what triggers certain automatic thoughts makes them easier to address and reverse. This worksheet is divided into 7 columns: 1. On the left, there's space to note the Date and Time when a dysfunctional thought arose. 2. The second column is where the Situation is detailed. The user is instructed to describe the event that led to the dysfunctional thought in detail. 3. The third column is for the Automatic Thought. Here the dysfunctional automatic thought is logged, along with a belief rating for the thought on a 0% to 100% scale. 4. The next column is where the Emotion or emotions triggered by this thought are detailed, also with an intensity rating on a 0% to 100% scale. 5. The fifth column is called 'Cognitive Distortion'. In this column, the user will identify which cognitive distortion(s) they're experiencing with respect to this specific dysfunctional thought, such as all-or-nothing thinking, filtering, jumping to conclusions, etc. 6. The second-to-last column is for the user to note Alternative Thoughts that are more positive and functional to replace the negative one. 7. Finally, the last column is for the user to note the Outcome of this exercise. Were you able to face the dysfunctional thought? Did you write a convincing alternative thought? Did your belief in the thought and/or the intensity of your emotion(s) decrease?",
    sections: [
      {
        id: "record",
        title: "The record",
        fields: [
          {
            type: "rows",
            id: "thought-record",
            label: "Fill in one row for each dysfunctional thought",
            columns: [
              {
                type: "text",
                id: "date",
                label: "Date and time. When did the thought occur?",
              },
              {
                type: "text",
                id: "situation",
                label: "Situation. What was the context? What was happening in the moment and before the thought?",
              },
              {
                type: "text",
                id: "thought",
                label: "Automatic thought. Describe the thought. Rate how much you believed it from 0% to 100%.",
              },
              {
                type: "text",
                id: "emotion",
                label: "Emotion. What feelings came up in the moment? How intense were they, from 0% to 100%?",
              },
              {
                type: "text",
                id: "distortion",
                label: "Cognitive distortion. E.g. filtering, personalization, catastrophizing.",
              },
              {
                type: "text",
                id: "alternative",
                label: "Alternative thought. What's a more adaptive alternative? Is there another possible solution?",
              },
              {
                type: "text",
                id: "outcome",
                label: "Outcome. Now rate again how much you believe the original thought and your emotions, from 0% to 100%.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "disputing-irrational-beliefs",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    measure: {
      id: "belief-strength",
      labelBefore: "Before: how much do you believe this belief?",
      labelAfter: "Now: how much do you believe this belief?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "Asks your belief uncomfortable questions: evidence for and against, extreme language, all-or-nothing. The goal is to tell a want apart from a need and keep a more reasonable belief.",
      example:
        "E.g.: Belief: 'I have to be the best at all times'. Evidence against: I haven't always been the best and things turned out fine anyway.",
    },
    title: "Disputing irrational beliefs",
    accepts: [{ kind: "belief", intoFieldId: "belief-description" }],
    description:
      "Beliefs and thoughts have an impact on how you feel, and how you feel influences what you choose to do. If thoughts are irrational, they can trigger, amplify, and maintain uncomfortable emotions. Rational beliefs distinguish between 'wants' and 'needs'. They're based on facts, they help us protect ourselves from likely harm, they help us achieve short- and long-term goals, they help us avoid significant conflicts with other people, and they help us feel the emotions we want to feel. It's not the event, but our interpretation of the event, that causes our emotional reaction. The process of Disputing Irrational Beliefs (DIBs) consists of challenging a belief by asking yourself the following questions: Can I rationally support this belief? Are these ideas logically connected? Who supports this idea and what authority do they have? What evidence exists that this belief is false? Are there exceptions? What are the worst things that could actually happen if I don't get what I think I want? What good things could I make happen if I don't get what I think I want?",
    sections: [
      {
        id: "belief",
        title: "The belief",
        fields: [
          {
            type: "text",
            id: "belief-description",
            label: "Choose an irrational belief and write it down below.",
            placeholder: "Write an irrational belief you have.",
          },
        ],
      },
      {
        id: "questions",
        title: "Challenging questions and answers",
        fields: [
          {
            type: "text",
            id: "question-1",
            label: "Question 1: What is the evidence for or against this idea? Answer using a new perspective.",
            placeholder: "Write your answer using a new perspective.",
          },
          {
            type: "text",
            id: "question-2",
            label: "Question 2: Am I confusing a habit with a fact? Answer using a new perspective.",
            placeholder: "Write your answer using a new perspective.",
          },
          {
            type: "text",
            id: "question-3",
            label: "Question 3: Am I thinking in all-or-nothing terms? Answer using a new perspective.",
            placeholder: "Write your answer using a new perspective.",
          },
          {
            type: "text",
            id: "question-4",
            label: "Question 4: Am I using extreme words like always, never, must, have to? Answer using a new perspective.",
            placeholder: "Write your answer using a new perspective.",
          },
        ],
      },
    ],
  },
  {
    id: "wdep-questions",
    version: 1,
    category: "action",
    intents: ["action"],
    help: {
      purpose:
        "A short Reality Therapy cycle: want, do, evaluate, plan. Useful for getting unstuck when you feel you're not moving forward.",
      example:
        "E.g.: W: 'I want to sleep better'. D: 'I go to bed late with my phone'. E: 'It's not working, I sleep 5 hours'. P: 'leave the phone outside the room at 11 pm, for 2 weeks'.",
    },
    title: "WDEP questions",
    description:
      "The WDEP model is a Reality Therapy technique that helps people reflect on what they want, what they're doing, whether it's working, and what their plan is. WDEP stands for: W - What do you want? D - What are you doing? E - Is it working? P - What is your plan?",
    sections: [
      {
        id: "want",
        title: "W: What do you want?",
        fields: [
          {
            type: "text",
            id: "want-description",
            label: "What do you want to be or do? What do you want instead of this problem? What would your ideal career, relationship, etc. be? What do your loved ones/friends want for you? What do you want to get out of this therapy?",
            placeholder: "Write what you want to be or do.",
          },
        ],
      },
      {
        id: "doing",
        title: "D: What are you doing?",
        fields: [
          {
            type: "text",
            id: "doing-description",
            label: "What are you doing (physically, mentally, emotionally)? What actions have you tried to take? What thoughts do you have when you act this way? What do you feel when you have these thoughts? How do these thoughts/actions impact your well-being?",
            placeholder: "Write what you're currently doing.",
          },
        ],
      },
      {
        id: "evaluate",
        title: "E: Is it working?",
        fields: [
          {
            type: "text",
            id: "evaluate-description",
            label: "Is your behavior working to help you get what you want? Are these actions taking you in the desired direction? Are you okay with how things are? Is what you want achievable? Is seeing things this way useful?",
            placeholder: "Write whether your actions are helping you.",
          },
        ],
      },
      {
        id: "plan",
        title: "P: What is your plan?",
        fields: [
          {
            type: "text",
            id: "plan-description",
            label: "What plan do you have to move in the desired direction? What will you change about your thoughts or actions to achieve this? When? How often? Where? Are you clear about what you're going to do? Is it realistic? How will you know you achieved it? Can you start now? Is it under your control? How committed are you to doing it?",
            placeholder: "Write your plan for moving in the desired direction.",
          },
        ],
      },
    ],
  },
  {
    id: "cataloging-inner-rules",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    measure: {
      id: "rule-belief",
      labelBefore: "Before: how much do you believe this rule?",
      labelAfter: "Now: how much do you believe this rule?",
      min: 0,
      max: 100,
    },
    help: {
      purpose:
        "Shows you the invisible rules you live by ('I must...', 'never...'), where they came from, and whether it's worth keeping, tossing, or changing any of them.",
      example:
        "E.g.: Infraction: 'I took a day off'. Rule: 'I must always be productive'. Decision: change it → 'rest is part of the plan too'.",
    },
    title: "Cataloging inner rules",
    description:
      "We all have rules that guide our behavior every day. We may not be able to articulate them clearly, but they're in our subconscious, pushing us toward behavior consistent with them. Many of these rules can be good, but some may not be adaptive or useful. Use this exercise to identify a questionable or harmful rule you have and challenge it.",
    sections: [
      {
        id: "infraction",
        title: "The infraction",
        fields: [
          {
            type: "text",
            id: "infraction-description",
            label: "What did you do that broke one of your inner rules?",
            placeholder: "Write what you did that went against one of your rules.",
          },
        ],
      },
      {
        id: "rule",
        title: "The rule",
        fields: [
          {
            type: "text",
            id: "rule-description",
            label: "What rule did your behavior break? Why did you feel bad after acting that way?",
            placeholder: "Write what rule was broken and why it made you feel bad.",
          },
        ],
      },
      {
        id: "origins",
        title: "The origins of the rule",
        fields: [
          {
            type: "text",
            id: "origins-description",
            label: "Where did this rule come from? What makes you think it's right or a good rule?",
            placeholder: "Think about where this rule came from and what makes you believe it's valid.",
          },
        ],
      },
      {
        id: "pros-cons",
        title: "Pros and cons of keeping this rule",
        fields: [
          {
            type: "text",
            id: "advantages",
            label: "How does this rule help you?",
            placeholder: "Write how keeping this rule benefits you.",
          },
          {
            type: "text",
            id: "disadvantages",
            label: "How does this rule hurt you?",
            placeholder: "Write how keeping this rule harms you.",
          },
        ],
      },
      {
        id: "decision",
        title: "What to do with this rule",
        fields: [
          {
            type: "choice",
            id: "decision",
            label: "What do you want to do with this rule?",
            options: [
              { value: "keep", label: "Keep it" },
              { value: "trash", label: "Toss it" },
              { value: "modify", label: "Change it" },
            ],
          },
        ],
      },
      {
        id: "going-forward",
        title: "The rule from now on",
        fields: [
          {
            type: "text",
            id: "going-forward",
            label: "What's the best possible version of this rule?",
            placeholder: "Write what the most adaptive and healthy version of this rule would look like.",
          },
        ],
      },
    ],
  },
];
