-- V2__seed_learning_and_routines.sql
-- Seed initial high-quality, accessible educational content for Learning Corner

INSERT INTO learning_contents (id, category_id, title, summary, original_text, simplified_text, reading_level, estimated_read_minutes)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'SCIENCE_NATURE',
    'The Secrets of the Honeybee Dance',
    'Discover how honeybees use a figure-eight waggle dance to tell hive members exactly where to find sweet wildflower nectar.',
    'Inside a dark honeybee hive, visual sight is limited, yet worker bees coordinate foraging with incredible mathematical precision. When a scout honeybee finds a rich meadow of blossoming wildflowers, she flies back to the hive and performs what biologists call the "waggle dance." 

During this dance, the bee runs in a figure-eight pattern on the honeycomb. The angle of her run in relation to gravity indicates the exact angle toward the flower patch relative to the sun. Furthermore, the duration of her abdomen vibration corresponds directly to distance: every second of waggling signals approximately one kilometer of flight distance.

By gathering closely and feeling the vibrations through their sensitive antennae and legs, neighboring bees decode this choreography and fly straight to the blossoming food source without ever being led individually.',
    'Honeybees have a special way of talking to each other without words! 

When a bee discovers a lovely field of flowers, it flies home to its hive and does a happy wiggle dance shaped like the number 8.

Here is how the dance works:
1. Direction: The angle the bee dances shows which direction to fly toward the sun.
2. Distance: How long the bee wiggles its tummy tells the other bees how far away the flowers are (1 second = about 1 kilometer).

Other bees touch the dancer with their antennae to feel the rhythm. Then they fly right to the flowers to collect sweet nectar!',
    'ACCESSIBLE',
    3
),
(
    'a2222222-2222-2222-2222-222222222222',
    'SCIENCE_NATURE',
    'The Whispering Forest: How Trees Communicate',
    'Beneath the forest soil lies an ancient web of fungal threads that allows trees to share nutrients and send helpful warning signals.',
    'When walking through a quiet forest, trees might seem like solitary beings standing quietly side by side. However, beneath the moss and damp earth lies a vast biological internet known as mycorrhizal networks, nicknamed the "Wood Wide Web."

Microscopic fungi connect their thread-like filaments (called hyphae) directly into tree roots. The fungi cannot perform photosynthesis, so the trees provide them with energy-rich sugars. In return, the fungal threads extend for miles, gathering water, phosphorus, and nitrogen that tree roots could never reach on their own.

Even more remarkably, trees use this network to support one another. Older "mother trees" send extra nourishment to young saplings shaded by the tall canopy. If pests or insects attack a tree, it sends biochemical warning pulses through the fungal network, prompting neighboring trees to produce protective leaf tannins before the pests arrive.',
    'Trees in the forest are actually great friends that help each other out!

Under the ground, tiny mushroom threads connect the roots of different trees like a cozy underground web.

What trees and fungi do together:
1. Sharing Food: Big trees share sweet sugars with young little trees that cannot reach enough sunlight yet.
2. Sending Water & Minerals: The fungal threads drink water deep in the ground and pass it up to thirsty trees.
3. Helpful Warnings: If a bug starts nibbling leaves on one tree, it sends a gentle message through the roots so neighboring trees can protect themselves.

The forest works as one big, supportive team!',
    'ACCESSIBLE',
    4
),
(
    'a3333333-3333-3333-3333-333333333333',
    'SPACE_EXPLORATION',
    'The Gentle Giant: Exploring Jupiter',
    'Learn about Jupiter, the largest planet in our solar system, with its swirling storms and cosmic shield protecting Earth.',
    'Jupiter is the undisputed king of our planetary system, possessing more than twice the mass of all other solar planets combined. It is a gas giant composed primarily of hydrogen and helium, without a solid surface upon which an astronaut could stand.

One of Jupiter''s most famous features is the Great Red Spot—a colossal anticyclonic storm that has raged for at least 350 years and is large enough to engulf the entire Earth. Jupiter also hosts an incredible family of 95 recognized moons, including Ganymede (the largest moon in our solar system) and Europa (an icy world with a deep subterranean ocean).

Beyond its beauty, Jupiter plays a vital protective role in our solar neighborhood. Its immense gravitational field acts like a gigantic cosmic vacuum cleaner, attracting or deflecting incoming comets and asteroids that might otherwise collide with Earth.',
    'Jupiter is the biggest planet in our entire solar system!

Fun facts about Jupiter:
1. Gas Giant: Jupiter is made of swirling gases and clouds, so there is no hard ground to walk on.
2. The Great Red Spot: A giant, swirling spinning storm that has been going on for hundreds of years.
3. Moon Family: Jupiter has 95 moons orbiting around it! One of them, Europa, has a huge ocean hidden under smooth ice.
4. Earth''s Gentle Protector: Because Jupiter is so huge, its gravity pulls dangerous wandering space rocks toward itself, keeping Earth safe and peaceful.',
    'ACCESSIBLE',
    3
),
(
    'a4444444-4444-4444-4444-444444444444',
    'EVERYDAY_SCIENCE',
    'Why Do We Need Sleep and Dreams?',
    'Discover how our brains tidy up memories, repair our bodies, and play creative dream movies every single night.',
    'Sleep is not simply a period of turning off like an electric light switch. In fact, our brain is extraordinarily active while we rest. Every night, our sleep cycles through different phases, including deep restorative slow-wave sleep and Rapid Eye Movement (REM) sleep.

During deep sleep, the brain''s glymphatic system washes away cellular waste products that accumulate throughout the busy day, while growth hormones work to repair muscles and tissues. 

During REM sleep, our brain reviews the day''s events, moving important facts and emotional lessons from short-term holding into long-term memory banks. This memory consolidation process often sparks dreams—vivid mental stories that allow our mind to practice scenarios, process feelings, and recharge creative thinking.',
    'Going to sleep is like your brain''s cozy nighttime superpower!

Here is what happens while you are sleeping:
1. Brain Tidy-Up: Just like cleaning up toys after a fun day, your brain cleans away tired chemicals and organizes your thoughts.
2. Memory Saving: Your mind moves things you learned today into your long-term memory chest so you remember them tomorrow.
3. Body Rest: Muscles relax and grow stronger.
4. Colorful Dreams: Dreams are your brain''s creative movie theater, helping you process feelings and wake up refreshed.',
    'ACCESSIBLE',
    3
)
ON CONFLICT (id) DO NOTHING;
