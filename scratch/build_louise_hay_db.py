import json
import os

def load_knowledge_base(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def save_knowledge_base(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def compile_louise_hay():
    # Database of A-Z mental causations from Louise Hay's "Heal Your Body"
    louise_hay_database = [
        {
            "problem": "Abdominal Cramps",
            "cause": "Fear. Stopping the process.",
            "affirmation": "I trust the process of life. I am safe."
        },
        {
            "problem": "Abscess",
            "cause": "Fermenting thoughts over hurts, slights, and revenge.",
            "affirmation": "I allow my thoughts to be free. The past is over. I am at peace."
        },
        {
            "problem": "Accidents",
            "cause": "Inability to speak up for the self. Rebellion against authority. Belief in violence.",
            "affirmation": "I release the pattern in me that created this. I am at peace. I am worthwhile."
        },
        {
            "problem": "Aches",
            "cause": "Longing for love. Longing to be held.",
            "affirmation": "I love and approve of myself. I am loving and lovable."
        },
        {
            "problem": "Acne",
            "cause": "Not accepting the self. Dislike of the self.",
            "affirmation": "I am a Divine expression of life. I love and accept myself where I am right now."
        },
        {
            "problem": "Addictions",
            "cause": "Running from the self. Fear. Not knowing how to love the self.",
            "affirmation": "I now discover how wonderful I am. I choose to love and enjoy myself."
        },
        {
            "problem": "Adenoids",
            "cause": "Family friction, arguments. Child feeling unwelcome, in the way.",
            "affirmation": "This child is wanted and welcomed and deeply loved."
        },
        {
            "problem": "Adrenal Problems",
            "cause": "Defeatism. No longer caring for the self. Anxiety.",
            "affirmation": "I love and approve of myself. It is safe for me to care for myself."
        },
        {
            "problem": "Aging Problems",
            "cause": "Social beliefs. Old thinking. Fear of being one's self. Rejection of the now.",
            "affirmation": "I love and accept myself at every age. Each moment in life is perfect."
        },
        {
            "problem": "AIDS",
            "cause": "Feeling defenseless and hopeless. Nobody cares. A strong belief in not being good enough. Denial of the self. Sexual guilt.",
            "affirmation": "I am part of the Universal design. I am important, and I am loved by Life itself. I am powerful and capable. I love and appreciate all of myself."
        },
        {
            "problem": "Alcoholism",
            "cause": "\"What's the use?\" Feeling of futility, guilt, inadequacy. Self-rejection.",
            "affirmation": "I live in the now. Each moment is new. I choose to see my self-worth. I love and approve of myself."
        },
        {
            "problem": "Allergies",
            "cause": "Who are you allergic to? Denying your own power.",
            "affirmation": "The world is safe and friendly. I am safe. I am at peace with life."
        },
        {
            "problem": "Alzheimer's Disease",
            "cause": "Refusal to deal with the world as it is. Hopelessness and helplessness. Anger.",
            "affirmation": "There is always a new and better way for me to experience life. I forgive and release the past. I move into joy."
        },
        {
            "problem": "Amenorrhea (Menstrual Problems)",
            "cause": "Not wanting to be a woman. Dislike of the self.",
            "affirmation": "I rejoice in who I am. I am a beautiful expression of life, flowing perfectly at all times."
        },
        {
            "problem": "Amnesia",
            "cause": "Fear. Running from life. Inability to stand up for the self.",
            "affirmation": "Intelligence, courage, and self-worth are always present. It is safe to be alive."
        },
        {
            "problem": "Anemia",
            "cause": "\"Yes-but\" attitude. Lack of joy. Fear of life. Not feeling good enough.",
            "affirmation": "It is safe for me to experience joy in every area of my life. I love life."
        },
        {
            "problem": "Ankle(s)",
            "cause": "Inflexibility and guilt. Ankles represent the ability to receive pleasure.",
            "affirmation": "I deserve to rejoice in life. I accept all the pleasure life has to offer."
        },
        {
            "problem": "Anus / Hemorrhoids",
            "cause": "Releasing point. Dumping ground. Anger in relation to what you don't want to release. Guilt over the past. Remorse.",
            "affirmation": "I easily and comfortably release that which I no longer need in life. I lovingly forgive myself. I am free."
        },
        {
            "problem": "Anxiety",
            "cause": "Not trusting the flow and the process of life.",
            "affirmation": "I love and approve of myself, and I trust the process of life. I am safe."
        },
        {
            "problem": "Appendicitis",
            "cause": "Fear. Fear of life. Blocking the flow of good.",
            "affirmation": "I am safe. I relax and let life flow joyously."
        },
        {
            "problem": "Appetite (Excessive / Loss)",
            "cause": "Fear. Needing protection. Judging the emotions. Protecting the self. Not trusting life.",
            "affirmation": "I am safe. It is safe to feel. My feelings are normal and acceptable. I love and approve of myself. I am safe. Life is safe and joyous."
        },
        {
            "problem": "Arm(s)",
            "cause": "Represents the capacity and ability to hold the experiences of life.",
            "affirmation": "I lovingly hold and embrace my experiences with ease and with joy."
        },
        {
            "problem": "Arteries / Arteriosclerosis",
            "cause": "Carry the joy of life. Resistance, tension. Hardened narrow-mindedness. Refusing to see good.",
            "affirmation": "I am filled with joy. It flows through me with every beat of my heart. I am completely open to life and to joy. I choose to see with love."
        },
        {
            "problem": "Arthritis / Joints / Fingers",
            "cause": "Feeling unloved. Criticism, resentment. A desire to punish. Blame. Feeling victimized.",
            "affirmation": "I am love. I now choose to love and approve of myself. I see others with love. I see with love and understanding. I hold all my experiences up to the light of love."
        },
        {
            "problem": "Asthma",
            "cause": "Smother love. Inability to breathe for oneself. Feeling stifled. Suppressed crying. Fear of life. Not wanting to be here.",
            "affirmation": "It is safe now for me to take charge of my own life. I choose to be free. This child is safe and loved. This child is welcomed and cherished."
        },
        {
            "problem": "Athlete's Foot",
            "cause": "Frustration at not being accepted. Inability to move forward with ease.",
            "affirmation": "I love and approve of myself. I give myself permission to go ahead. It's safe to move."
        },
        {
            "problem": "Back / Back Problems (Lower, Middle, Upper)",
            "cause": "Lower: Fear of money. Lack of financial support. Middle: Guilt. Stuck in all that stuff back there. Get off my back. Upper: Lack of emotional support. Feeling unloved. Holding back love.",
            "affirmation": "I trust the process of life. All I need is always taken care of. I am safe. I release the past. I am free to move forward with love in my heart. I love and approve of myself. Life supports and loves me."
        },
        {
            "problem": "Bad Breath (Halitosis)",
            "cause": "Anger and revenge thoughts. Experiences backing up.",
            "affirmation": "I release the past with love. I choose to voice only love."
        },
        {
            "problem": "Baldness",
            "cause": "Fear. Tension. Trying to control everything. Not trusting the process of life.",
            "affirmation": "I am safe. I love and approve of myself. I trust life."
        },
        {
            "problem": "Bedwetting (Enuresis)",
            "cause": "Fear of parent, usually the father.",
            "affirmation": "This child is seen with love, with compassion, and with understanding. All is well."
        },
        {
            "problem": "Belching",
            "cause": "Fear. Gulping life too quickly.",
            "affirmation": "There is time and space for everything I need to do. I am at peace."
        },
        {
            "problem": "Bladder Problems (Cystitis)",
            "cause": "Anxiety. Holding on to old ideas. Fear of letting go. Being pissed off.",
            "affirmation": "I comfortably and easily release the old and welcome the new in my life. I am safe."
        },
        {
            "problem": "Bleeding",
            "cause": "Joy running out. Anger. But where?",
            "affirmation": "I am the joy of Life expressing and receiving in perfect rhythm."
        },
        {
            "problem": "Bleeding Gums",
            "cause": "Lack of joy in the decision made in life.",
            "affirmation": "I trust that right action is always taking place in my life. I am at peace."
        },
        {
            "problem": "Blood Pressure (High / Low)",
            "cause": "High: Long-standing emotional problem not solved. Low: Lack of love as a child. Defeatism. \"What's the use? It won't work anyway.\"",
            "affirmation": "I joyously release the past. I am at peace. I now choose to live in the ever-joyous NOW. My life is a joy."
        },
        {
            "problem": "Bowels (Bowels Problems)",
            "cause": "Bowels represent the release of waste. Fear of letting go of the old and no longer needed.",
            "affirmation": "Letting go is easy. I freely and easily release the old and joyously welcome the new."
        },
        {
            "problem": "Brain / Brain Tumor",
            "cause": "Incorrect computerized beliefs. Stubborn. Refusing to change old patterns.",
            "affirmation": "I am the loving operator of my mind. It is easy for me to reprogram the computer of my mind. All of life is change, and my mind is ever new."
        },
        {
            "problem": "Breast(s) / Breast Problems",
            "cause": "Represents mothering, nurturing, and nourishment. A refusal to nourish the self. Putting everyone else first. Overmothering. Overprotection. Overbearing attitudes.",
            "affirmation": "I take in and give out nourishment in perfect balance. I am important. I count. I now care for and nourish myself with love and with joy. I allow others the freedom to be who they are. We are all safe and free."
        },
        {
            "problem": "Breath / Breathing Problems",
            "cause": "Represents the ability to take in life. Fear or refusal to take in life fully. Not feeling the right to take up space or even exist.",
            "affirmation": "I love life. It is safe to live. It is my birthright to live fully and freely. I am worth loving. I now choose to live life fully."
        },
        {
            "problem": "Bronchitis",
            "cause": "Inflamed family environment. Arguments and yelling. Sometimes silent.",
            "affirmation": "I declare peace and harmony within me and around me. All is well."
        },
        {
            "problem": "Bruises",
            "cause": "The little bumps in life. Self-punishment.",
            "affirmation": "I love and cherish myself. I am kind and gentle with me. All is well."
        },
        {
            "problem": "Bulimia",
            "cause": "Hopeless terror. A frantic stuffing and purging of self-hatred.",
            "affirmation": "I am loved and nourished and supported by Life itself. It is safe for me to be alive."
        },
        {
            "problem": "Burns",
            "cause": "Anger. Burning up. Incensed.",
            "affirmation": "I create only peace and harmony within myself and in my environment. I deserve to feel good."
        },
        {
            "problem": "Buttocks",
            "cause": "Represent power. Loose buttocks, loss of power.",
            "affirmation": "I use my power wisely. I am strong. I am safe. All is well."
        },
        {
            "problem": "Cancer",
            "cause": "Deep hurt. Long-standing resentment. Deep secret or grief eating away at the self. Carrying hatreds. \"What's the use?\"",
            "affirmation": "I lovingly forgive and release all of the past. I choose to fill my world with joy. I love and approve of myself."
        },
        {
            "problem": "Canker Sores",
            "cause": "Festering words held back by the lips. Blame.",
            "affirmation": "I create only joyful experiences in my loving world."
        },
        {
            "problem": "Cataracts",
            "cause": "Inability to see ahead with joy. Dark future.",
            "affirmation": "Life is eternal and filled with joy. I look forward to every moment."
        },
        {
            "problem": "Cellulite",
            "cause": "Stored anger and self-punishment.",
            "affirmation": "I forgive others. I forgive myself. I am free to love and enjoy life."
        },
        {
            "problem": "Childhood Diseases",
            "cause": "Belief in calendars and social concepts and false laws. Childish behavior in the adults around them.",
            "affirmation": "This child is Divinely protected and surrounded by love. We claim mental immunity."
        },
        {
            "problem": "Chills",
            "cause": "Mental contraction, pulling away and in. Desire to retreat. \"Leave me alone.\"",
            "affirmation": "I am safe and secure at all times. Love surrounds me and protects me. All is well."
        },
        {
            "problem": "Cholesterol (Atherosclerosis)",
            "cause": "Clogging the channels of joy. Fear of accepting joy.",
            "affirmation": "I choose to love life. My channels of joy are wide open. It is safe to receive."
        },
        {
            "problem": "Chronic Diseases",
            "cause": "A refusal to change. Fear of the future. Not feeling safe.",
            "affirmation": "I am willing to change and to grow. I now create a safe, new future."
        },
        {
            "problem": "Circulation",
            "cause": "Represents the ability to feel and express the emotions in positive ways.",
            "affirmation": "I am free to circulate love and joy in every part of my world. I love life."
        },
        {
            "problem": "Colds / Cold Sores",
            "cause": "Too much going on at once. Mental confusion, disorder. Small hurts. Festering angry words and fear of expressing them.",
            "affirmation": "I allow my mind to relax and be at peace. Clarity and harmony are within me and around me. All is well. I only create peaceful experiences because I love myself. All is well."
        },
        {
            "problem": "Colic",
            "cause": "Mental irritation, impatience, annoyance in the surroundings.",
            "affirmation": "This child responds only to love and to loving thoughts. All is peaceful."
        },
        {
            "problem": "Colitis / Colon",
            "cause": "Insecurity. Represents the ease of letting go of that which is over. Holding on to the past. Fear of letting go.",
            "affirmation": "I am part of the perfect rhythm and flow of life. All is in Divine right order. I easily release that which I no longer need. The past is over, and I am free."
        },
        {
            "problem": "Coma",
            "cause": "Fear. Escaping something or someone.",
            "affirmation": "We surround you with safety and love. We create a space for you to heal. You are loved."
        },
        {
            "problem": "Constipation",
            "cause": "Refusing to release old ideas. Stuck in the past. Sometimes stinginess.",
            "affirmation": "As I release the past, the new and fresh and vital enter. I allow life to flow through me."
        },
        {
            "problem": "Corns",
            "cause": "Hardened areas of thought—stubbornly holding on to the pain of the past.",
            "affirmation": "I move forward, free from the past. I am safe; I am free."
        },
        {
            "problem": "Coughs",
            "cause": "A desire to bark at the world. \"See me! Listen to me!\"",
            "affirmation": "I am noticed and appreciated in the most positive ways. I am loved."
        },
        {
            "problem": "Cramps",
            "cause": "Tension. Fear. Gripping, holding on.",
            "affirmation": "I relax and allow my mind to be peaceful."
        },
        {
            "problem": "Crying",
            "cause": "Tears are the river of life, shed in joy as well as in sadness and fear.",
            "affirmation": "I am peaceful with all of my emotions. I love and approve of myself."
        },
        {
            "problem": "Cuts / Wounds",
            "cause": "Punishment for not following your own rules. Anger and guilt at the self.",
            "affirmation": "I create a life filled with rewards. I forgive myself, and I choose to love myself."
        },
        {
            "problem": "Cyst(s)",
            "cause": "Running the old painful movie. Nursing hurts. A false growth.",
            "affirmation": "The movies of my mind are beautiful because I choose to make them so. I love me."
        },
        {
            "problem": "Cystic Fibrosis",
            "cause": "A thick belief that life won't work for you. \"Poor me.\"",
            "affirmation": "Life loves me, and I love life. I now choose to take in life fully and freely."
        },
        {
            "problem": "Deafness",
            "cause": "Rejection, stubbornness, isolation. What don't you want to hear? \"Don't bother me.\"",
            "affirmation": "I listen to the Divine and rejoice at all that I am able to hear. I am one with all."
        },
        {
            "problem": "Death",
            "cause": "Represents leaving the movie of life.",
            "affirmation": "I joyfully move on to new levels of experience. All is well."
        },
        {
            "problem": "Dementia (Senility)",
            "cause": "A refusal to deal with the world as it is. Hopelessness and anger.",
            "affirmation": "I am in my perfect place, and I am safe at all times."
        },
        {
            "problem": "Depression",
            "cause": "Anger you feel you do not have a right to have. Hopelessness.",
            "affirmation": "I now go beyond other people's fears and limitations. I create my life."
        },
        {
            "problem": "Diabetes (Hyperglycemia)",
            "cause": "Longing for what might have been. A great need to control. Deep sorrow. No sweetness left.",
            "affirmation": "This moment is filled with joy. I now choose to experience the sweetness of today."
        },
        {
            "problem": "Diarrhea",
            "cause": "Fear. Rejection. Running off.",
            "affirmation": "My intake, assimilation, and elimination are in perfect order. I am at peace with life."
        },
        {
            "problem": "Dizziness (Vertigo)",
            "cause": "Flighty, scattered thinking. A refusal to look.",
            "affirmation": "I am deeply centered and peaceful in life. It is safe for me to be alive and joyous."
        },
        {
            "problem": "Dry Eye",
            "cause": "Angry eyes. Refusing to see with love. Would rather die than forgive. Being spiteful.",
            "affirmation": "I willingly forgive. I breathe life into my vision and see with compassion and understanding."
        },
        {
            "problem": "Dysentery (Amoebic / Bacillary)",
            "cause": "Fear and intense anger. Believing they are out to get you. Oppression and hopelessness.",
            "affirmation": "I create peacefulness in my mind, and my body reflects this. I am the power and authority in my world. I am at peace. I am filled with life and energy and the joy of living."
        },
        {
            "problem": "Ear(s) / Earache / Tinnitus",
            "cause": "Represents the capacity to hear. Anger. Not wanting to hear. Too much turmoil. Parents arguing. Refusal to listen. Not hearing the inner voice. Stubbornness.",
            "affirmation": "I hear with love. Harmony surrounds me. I listen with love to the pleasant and the good. I am a center for love. I trust my Higher Self. I listen with love to my inner voice. I release all that is unlike the action of love."
        },
        {
            "problem": "Eczema",
            "cause": "Breathtaking antagonism. Mental eruptions.",
            "affirmation": "Harmony and peace, love and joy surround me and indwell me. I am safe and secure."
        },
        {
            "problem": "Edema (Swelling)",
            "cause": "What or whom won't you let go of?",
            "affirmation": "I willingly release the past. It is safe for me to let go. I am free now."
        },
        {
            "problem": "Elbow",
            "cause": "Represents changing directions and accepting new experiences.",
            "affirmation": "I easily flow with new experiences, new directions, and new changes."
        },
        {
            "problem": "Emphysema",
            "cause": "Fear of taking in life. Not worthy of living.",
            "affirmation": "It is my birthright to live fully and freely. I love life. I love me."
        },
        {
            "problem": "Endometriosis",
            "cause": "Insecurity, disappointment, and frustration. Replacing self-love with sugar. Blamers.",
            "affirmation": "I am both powerful and desirable. It's wonderful to be a woman. I love myself, and I am fulfilled."
        },
        {
            "problem": "Epilepsy",
            "cause": "Sense of persecution. Rejection of life. A feeling of great struggle. Self-violence.",
            "affirmation": "I choose to see life as eternal and joyous. I am eternal and joyous and at peace."
        },
        {
            "problem": "Epstein-Barr Virus",
            "cause": "Pushing beyond one's limits. Fear of not being good enough. Draining all inner support. Stress virus.",
            "affirmation": "I relax and recognize my self-worth. I am good enough. Life is easy and joyful."
        },
        {
            "problem": "Eye Problems / Glaucoma / Nearsightedness / Farsightedness",
            "cause": "Not liking what you see in your own life. Stony unforgiveness. Fear of the future. Fear of the present. Rejection of looking at what is right here.",
            "affirmation": "I see with love and tenderness. I accept Divine guidance and am always safe. I love and approve of myself right now. I now create a life I love to look at."
        },
        {
            "problem": "Fat / Overweight",
            "cause": "Oversensitivity. Often represents fear and shows a need for protection. Fear may be a cover for hidden anger and a resistance to forgive.",
            "affirmation": "I am protected by Divine Love. I am always safe and secure. I am willing to grow up and take responsibility for my life. I forgive others, and I now create my own life the way I want it. I am safe."
        },
        {
            "problem": "Fatigue",
            "cause": "Resistance, boredom. Lack of love for what one does.",
            "affirmation": "I am enthusiastic about life and filled with energy and enthusiasm."
        },
        {
            "problem": "Feet",
            "cause": "Represents our understanding—of ourselves, of life, of others.",
            "affirmation": "My understanding is clear, and I am willing to change with the times. I am safe."
        },
        {
            "problem": "Fever",
            "cause": "Anger. Burning up.",
            "affirmation": "I am the cool, calm expression of peace and love."
        },
        {
            "problem": "Fibroid Tumors & Cysts",
            "cause": "Nursing a hurt from a partner. A blow to the feminine ego.",
            "affirmation": "I release the pattern in me that attracted this experience. I create only good in my life."
        },
        {
            "problem": "Fistula",
            "cause": "Fear. A blockage in the letting-go process.",
            "affirmation": "I am safe. I trust fully in the process of life. Life is for me."
        },
        {
            "problem": "Food Poisoning",
            "cause": "Allowing others to take control. Feeling defenseless.",
            "affirmation": "I have the strength, power, and skill to digest whatever comes my way."
        },
        {
            "problem": "Foot Problems",
            "cause": "Fear of the future and of not stepping forward in life.",
            "affirmation": "I move forward in life, with joy and with ease."
        },
        {
            "problem": "Gallstones",
            "cause": "Bitterness. Hard thoughts. Condemning. Pride.",
            "affirmation": "There is joyous release of the past. Life is sweet, and so am I."
        },
        {
            "problem": "Goiter / Thyroid Problems",
            "cause": "Hatred for being inflicted upon. Victim. Feeling thwarted in life. Unfulfilled. Humiliation. \"I never get to do what I want to do.\"",
            "affirmation": "I am the power and authority in my life. I am free to be me. I move beyond old limitations and now allow myself to express freely and creatively."
        },
        {
            "problem": "Gout",
            "cause": "The need to dominate. Impatience, anger.",
            "affirmation": "I am safe and secure. I am at peace with myself and with others."
        },
        {
            "problem": "Gray Hair",
            "cause": "Stress. A belief in pressure and strain.",
            "affirmation": "I am at peace and comfortable in every area of my life. I am strong and capable."
        },
        {
            "problem": "Growths",
            "cause": "Nursing those old hurts. Building resentments.",
            "affirmation": "I easily forgive. I love myself and will reward myself with thoughts of praise."
        },
        {
            "problem": "Gum Problems",
            "cause": "Inability to back up decisions. Wishy-washy about life.",
            "affirmation": "I am a decisive person. I follow through and support myself with love."
        },
        {
            "problem": "Hands",
            "cause": "Hold and handle. Clutch and grip. Grasping and letting go. Caressing. Pinching. All ways of dealing with experiences.",
            "affirmation": "I choose to handle all my experiences with love and with joy and with ease."
        },
        {
            "problem": "Headaches / Migraine",
            "cause": "Invalidating the self. Self-criticism. Fear. Dislike of being driven. Resisting the flow of life. Sexual fears.",
            "affirmation": "I love and approve of myself. I see myself and what I do with eyes of love. I am safe. I relax into the flow of life and let life provide all that I need easily and comfortably. Life is for me."
        },
        {
            "problem": "Heart / Heart Attack",
            "cause": "Represents the center of love and security. Squeezing all the joy out of the heart in favor of money or position, etc. Long-standing emotional problems. Lack of joy.",
            "affirmation": "My heart beats to the rhythm of love. I bring joy back to the center of my heart. I express love to all. Joy. Joy. Joy. I lovingly allow joy to flow through my mind and body and experience."
        },
        {
            "problem": "Heartburn / Ulcers",
            "cause": "Fear. Fear. Fear. Clutching fear. A strong belief that you are not good enough.",
            "affirmation": "I breathe freely and fully. I am safe. I trust the process of life. I love and approve of myself. I am at peace. I am calm. All is well."
        },
        {
            "problem": "Hip Problems",
            "cause": "Fear of going forward in major decisions. Nothing to move forward to.",
            "affirmation": "I am in perfect balance. I move forward in life with ease and with joy at every age."
        },
        {
            "problem": "Indigestion",
            "cause": "Gut-level fear, dread, anxiety. Griping and grunting.",
            "affirmation": "I digest and assimilate all new experiences peacefully and joyously."
        },
        {
            "problem": "Inflammation",
            "cause": "Fear. Seeing red. Inflamed thinking.",
            "affirmation": "My thinking is peaceful, calm, and centered."
        },
        {
            "problem": "Insomnia",
            "cause": "Fear. Not trusting the process of life. Guilt.",
            "affirmation": "I lovingly release the day and slip into peaceful sleep, knowing tomorrow will take care of itself."
        },
        {
            "problem": "Itching (Pruritus)",
            "cause": "Desires that go against the grain. Unsatisfied. Remorse. Itching to get out or get away.",
            "affirmation": "I am at peace just where I am. I accept my good, knowing all my needs and desires will be fulfilled."
        },
        {
            "problem": "Kidney Problems / Stones",
            "cause": "Criticism, disappointment, failure. Shame. Reacting like a little kid. Lumps of undissolved anger.",
            "affirmation": "Divine right action is always taking place in my life. Only good comes from each experience. It is safe to grow up. I dissolve all past problems with ease."
        },
        {
            "problem": "Knee / Knee Problems",
            "cause": "Represents pride and ego. Stubborn ego and pride. Inability to bend. Fear. Inflexibility. Won't give in.",
            "affirmation": "I am flexible and flowing. Forgiveness. Understanding. Compassion. I bend and flow with ease, and all is well."
        },
        {
            "problem": "Laryngitis",
            "cause": "So mad you can't speak. Fear of speaking up. Resentment of authority.",
            "affirmation": "I am free to ask for what I want. It is safe to express myself. I am at peace."
        },
        {
            "problem": "Liver Problems",
            "cause": "Seat of anger and primitive emotions. Chronic complaining. Justifying faultfinding to deceive yourself. Feeling bad.",
            "affirmation": "Love and peace and joy are what I know. I choose to live through the open space in my heart. I look for love and find it everywhere."
        },
        {
            "problem": "Lump in Throat",
            "cause": "Fear. Not trusting the process of life.",
            "affirmation": "I am safe. I trust that Life is here for me. I express myself freely and joyously."
        },
        {
            "problem": "Lung / Lung Problems",
            "cause": "The ability to take in life. Depression. Grief. Fear of taking in life. Not feeling worthy of living life fully.",
            "affirmation": "I take in life in perfect balance. I have the capacity to take in the fullness of life. I lovingly live life to the fullest."
        },
        {
            "problem": "Lupus",
            "cause": "A giving up. Better to die than stand up for oneself. Anger and punishment.",
            "affirmation": "I speak up for myself freely and easily. I claim my own power. I love and approve of myself. I am free and safe."
        },
        {
            "problem": "Nail Biting",
            "cause": "Frustration. Eating away at the self. Spite of a parent.",
            "affirmation": "It is safe for me to grow up. I now handle my own life with joy and with ease."
        },
        {
            "problem": "Neck / Stiff Neck",
            "cause": "Represents flexibility. The ability to see what's back there. Refusing to see other sides of a question. Stubbornness, inflexibility.",
            "affirmation": "I am peaceful with life. It is with flexibility and ease that I see all sides of an issue. There are endless ways to do things and see things. I am safe. It is safe to see other viewpoints."
        },
        {
            "problem": "Pneumonia",
            "cause": "Desperate. Tired of life. Emotional wounds that are not allowed to heal.",
            "affirmation": "I freely take in Divine ideas that are filled with the breath and the intelligence of Life. This is a new moment."
        },
        {
            "problem": "Prostate Problems",
            "cause": "Mental fears weaken masculinity. Giving up. Sexual pressure and guilt. Belief in aging.",
            "affirmation": "I love and approve of myself. I accept my own power. I am forever young in spirit."
        },
        {
            "problem": "Sciatica",
            "cause": "Being hypocritical. Fear of money and of the future.",
            "affirmation": "I move into my greater good. My good is everywhere, and I am secure and safe."
        },
        {
            "problem": "Skin Problems",
            "cause": "Anxiety, fear. Old, buried guck. I am being threatened.",
            "affirmation": "I lovingly protect myself with thoughts of joy and peace. The past is forgiven and forgotten. I am free in this moment."
        },
        {
            "problem": "Spasm(s)",
            "cause": "Tightening our thoughts through fear.",
            "affirmation": "I release, I relax, and I let go. I am safe in life."
        },
        {
            "problem": "Stomach Problems (Gastritis)",
            "cause": "Dread. Fear of the new. Inability to assimilate the new.",
            "affirmation": "Life agrees with me. I assimilate the new every moment of every day. All is well."
        },
        {
            "problem": "Throat / Tonsillitis",
            "cause": "Avenue of expression. Channel of creativity. The inability to speak up for oneself. Swallowed anger. Stifled creativity. Refusal to change. Fear. Repressed emotions.",
            "affirmation": "I open my heart and sing the joys of love. It's okay to make noise. I express myself freely and joyously. I speak up for myself with ease. I express my creativity. I am willing to change. My good now flows freely. Divine ideas express through me. I am at peace."
        },
        {
            "problem": "Varicose Veins",
            "cause": "Standing in a situation you hate. Discouragement. Feeling overworked and overburdened.",
            "affirmation": "I stand in truth and live and move in joy. I love Life and circulate freely."
        },
        {
            "problem": "Vomiting",
            "cause": "Violent rejection of ideas. Fear of the new.",
            "affirmation": "I digest life safely and joyously. Only good comes to me and through me."
        }
    ]

    print("Compiling Louise Hay book database into knowledge.json...")
    knowledge_path = "/Users/honeyvachhani/.gemini/antigravity/scratch/mirror-magic-agent/knowledge.json"
    knowledge = load_knowledge_base(knowledge_path)
    
    # Track existing sources to prevent infinite duplicates
    existing_contents = {chunk["content"] for chunk in knowledge}
    added_count = 0
    
    for item in louise_hay_database:
        # Formulate a structured text chunk representing this condition
        content_text = f"Somatic Metaphysical Mapping for {item['problem']}:\n- Probable Mental Cause: {item['cause']}\n- New Thought Pattern (Healing Affirmation): \"{item['affirmation']}\"\nFrom Louise Hay's Heal Your Body system."
        
        if content_text not in existing_contents:
            knowledge.append({
                "source": "Louise_Hay_Heal_Your_Body.txt",
                "content": content_text
            })
            existing_contents.add(content_text)
            added_count += 1
            
    save_knowledge_base(knowledge_path, knowledge)
    print(f"Successfully compiled. Added {added_count} new metaphysical mapping chunks into local knowledge.json.")

if __name__ == "__main__":
    compile_louise_hay()
