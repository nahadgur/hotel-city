export type Hotel = {
  slug: string
  name: string
  city: string
  region: string
  address: string
  postcode: string
  nearestStation: string
  openedYear: string
  architect: string
  listedStatus: string
  rooms: string
  restaurants: string[]
  bars: string[]
  owner: string
  operator: string
  oneLiner: string
  architectureHistory: string
  brief: string[]
  stayWardNote: string
  siblings: string[]
}

export const hotels: Hotel[] = [
  {
    slug: "the-savoy-london",
    name: "The Savoy",
    city: "London",
    region: "london",
    address: "Strand, London",
    postcode: "WC2R 0EZ",
    nearestStation: "Charing Cross (3 min walk)",
    openedYear: "1889",
    architect: "Thomas Edward Collcutt",
    listedStatus: "Grade II",
    rooms: "267",
    restaurants: ["Savoy Grill", "Restaurant 1890", "River Restaurant", "Simpson's in the Strand", "Thames Foyer"],
    bars: ["American Bar", "Beaufort Bar", "Thames Foyer"],
    owner: "Kingdom Holding (50%), FRHI / Katara (50%)",
    operator: "Fairmont Hotels and Resorts",
    oneLiner: "The only five-star hotel on the Thames, opened 1889, where modern hotel service was effectively invented.",
    architectureHistory: "The Savoy was financed by the theatrical impresario Richard D'Oyly Carte, using profits from the Gilbert and Sullivan operas he produced at the neighbouring Savoy Theatre. The hotel was the first purpose-built luxury hotel in Britain and the first in Europe to install electric lighting throughout, en-suite bathrooms in every room, and hydraulic lifts (which the hotel called ascending rooms so as not to alarm guests). Construction began in 1886. The building is a steel-framed structure finished in glazed white brick, with interior design overseen by Arthur Mackmurdo. The Art Deco Thames-facing wing was added later, which is why the hotel presents two distinct architectural personalities depending on which facade you approach. Grade II listed, 16 January 1981.",
    brief: [
      "The Savoy sits on the one patch of the Strand that matters, which is the sliver of it facing the Thames. Every other grand hotel in London has had to improvise its view; The Savoy was built for the river. The southern suites look directly across the water to the South Bank, and the Riverside Entrance, the one most guests never see, opens onto the Embankment Gardens in a way that feels more Parisian than London.",
      "The hotel's place in the story of modern hospitality is hard to overstate. Its first manager was César Ritz. Its first head chef was Auguste Escoffier. Between them they wrote, in this building, what is still essentially the operating manual for European luxury service. The brigade kitchen system, the tasting menu, the practice of plating in the kitchen rather than carving at the table, all of it was codified here in the 1890s before either man left to open the hotel bearing Ritz's name further along Piccadilly.",
      "The rooms split between the original Edwardian wing, which faces the Strand and is built around the central courtyard where cabs still arrive, and the 1920s Art Deco River Wing, which faces the Thames. The two moods are genuinely different. The Edwardian rooms are formal, high-ceilinged, and wood-panelled; the Art Deco rooms are lighter, with the black-lacquer-and-chrome vocabulary of Basil Ionides and the period. If you mind which era you sleep in, say so when you book, because they are not interchangeable.",
      "The restaurants are the clearest demonstration of how modern The Savoy manages its heritage. Savoy Grill, Restaurant 1890, and the River Restaurant all operate under the Gordon Ramsay group. The American Bar has been continuously operational since 1893, making it one of the oldest surviving cocktail bars in London; the 1930 Savoy Cocktail Book was written at its counter by head barman Harry Craddock. Simpson's in the Strand, which occupies its own wing, predates the hotel itself (1828) and still carves roast beef at the table.",
      "The Strand itself is a working thoroughfare rather than a luxury quarter, which suits people who want to be in the middle of London rather than cloistered in Mayfair. Covent Garden is five minutes' walk north, the theatres of Drury Lane and the Aldwych are immediately adjacent, the river is at the bottom of the forecourt, and Temple, Somerset House, and the City are walkable east. For anyone whose London is not confined to Mayfair, the Strand is a more efficient base.",
      "The Savoy suits grand-occasion stays, Thames-facing suites specifically, West End theatre trips, and the kind of extended business visit where the American Bar is a useful asset. It suits history. It does not suit anyone looking for a quiet, residential hotel; the Strand is busy, the lobby is public, and the American Bar alone ensures foot traffic until late.",
    ],
    stayWardNote: "The Savoy publishes its rates across Booking.com, Expedia, and its own site with strict parity, which is why you will see the same number quoted to you regardless of where you look. Every major OTA contract, however, explicitly permits the hotel to offer a different rate in a private quote sent directly to an individual traveller. That is what we ask for on your behalf. When we ask, private rates we have been quoted for shoulder-season midweek stays have typically landed 10 to 20 per cent below the public parity rate, sometimes with added breakfast, late checkout, or a room-category upgrade. Not guaranteed. Hotels decide case by case.",
    siblings: ["claridges-london", "the-connaught-london", "the-ritz-london", "the-dorchester-london"],
  },
  {
    slug: "claridges-london",
    name: "Claridge's",
    city: "London",
    region: "london",
    address: "Brook Street, Mayfair, London",
    postcode: "W1K 4HR",
    nearestStation: "Bond Street (4 min walk)",
    openedYear: "1856 (original); current building 1898",
    architect: "C.W. Stephens (building); Basil Ionides (Art Deco interiors, 1920s)",
    listedStatus: "Grade II",
    rooms: "203 rooms and suites",
    restaurants: ["Claridge's Restaurant", "The Foyer & Reading Room"],
    bars: ["Claridge's Bar", "The Fumoir", "The Painter's Room"],
    owner: "Maybourne Hotel Group",
    operator: "Maybourne Hotel Group",
    oneLiner: "Mayfair's quieter grand hotel, behind a red-brick Victorian facade, with Art Deco interiors and a five-level basement added without disturbing either.",
    architectureHistory: "The site was originally Mivart's Hotel, opened 1812 in a row of Georgian terraces on Brook Street. William and Marianne Claridge acquired it in 1854 and merged it with their own hotel next door. In 1893 Richard D'Oyly Carte (of The Savoy) bought the business, demolished the aging Georgian buildings, and commissioned architect C.W. Stephens to design the current red-brick Victorian building, which opened in 1898. The Art Deco interiors most guests associate with Claridge's were installed in the 1920s by Basil Ionides. Between 2016 and 2021, the hotel executed one of the most complex private excavation projects in London: a hand-dug, 22-metre-deep basement built across five levels, added beneath the original building without disturbing the protected Victorian facade or the operational guestrooms above. The work was documented in the BBC series The Mayfair Hotel Megabuild. Grade II listed, 8 May 1981.",
    brief: [
      "Claridge's is the quiet one. Of the five or six London hotels that occupy the top of the category, this is the least visible from the street. It sits on the corner of Brook Street and Davies Street in the middle of Mayfair, a part of London with no tourist draws and very little passing foot traffic, which is exactly the point. The hotel is set back from Piccadilly and Park Lane. It is not a landmark you walk past; you have to be going to it on purpose.",
      "That privacy has defined its clientele for 160 years. Queen Victoria visited in 1860. The Empress Eugenie took a suite the same year. During the Second World War, the hotel housed the exiled royal families of Yugoslavia, Greece, and Norway simultaneously; on 17 July 1945, Suite 212 was formally declared Yugoslav sovereign territory for a single day so that Crown Prince Alexander could be born there, meeting the constitutional requirement that the heir be born on Yugoslav soil. In 1951 the West German Chancellor Konrad Adenauer used the hotel to negotiate Holocaust reparations with Nahum Goldmann of the World Jewish Congress. Winston Churchill lived in a suite here for several months in 1945 after losing the general election.",
      "Inside, the hotel's two architectural layers (Victorian shell, Art Deco interior) remain visible and mostly unreconciled, which is part of its character. The black-and-white chequerboard lobby floor, the sweeping staircase, the lifts with their gilded cage doors, all date from the 1920s. The 2016 to 2021 refurbishment added 39 new rooms (including a four-storey rooftop extension), a full-floor spa with a 19-metre mosaic pool across two of the new basement levels, and a new restaurant and café. The expansion roughly doubled the usable floor area of the hotel without changing anything visible from Brook Street.",
      "The current culinary setup is in a transitional phase that has lasted, honestly, a decade. Claridge's has cycled through residencies from Gordon Ramsay, Simon Rogan (Fera), and Daniel Humm (Davies and Brook, which held two Michelin stars before closing during the pandemic), before settling on Claridge's Restaurant, a house-operated room opened in 2023. The afternoon tea in the Foyer and Reading Room remains the most consistently sought-after reservation in London at that meal. The bars are distinct and deliberately compartmentalised: Claridge's Bar for Art Deco classic cocktails, the Fumoir for something small and darker, and the Painter's Room for contemporary mixology behind a discreet door off the lobby.",
      "Mayfair outside the hotel is residential and commercial rather than cultural. The immediate surroundings are Mount Street (luxury retail, Scott's, George), New Bond Street (auction houses, flagship stores), Berkeley Square, and Grosvenor Square. Hyde Park is a seven-minute walk. The West End theatres are ten. It is a neighbourhood that rewards people who already know what they want to do; there are no obvious landmarks to wander towards.",
      "Claridge's suits grand-occasion stays where the point is privacy as much as grandeur. It suits Mayfair-native clientele, returning visitors, and anyone who wants to feel less like a guest and more like a tenant. It does not suit anyone who wants a river view, who wants to walk out of the hotel into visible tourist London, or who finds the Art Deco formality performative.",
    ],
    stayWardNote: "Claridge's participates in rate parity across all major booking channels, which is why the headline rate is identical across Booking.com, Hotels.com, and claridges.co.uk. The exception, written into every OTA contract, is a private rate offered directly to an individual traveller. When we ask on behalf of a traveller, private rates we have been quoted for shoulder-season midweek dates have typically landed 10 to 20 per cent below the public parity rate, sometimes with added breakfast or a room-category upgrade. Not guaranteed. Hotels decide case by case.",
    siblings: ["the-savoy-london", "the-connaught-london", "the-ritz-london", "the-dorchester-london"],
  },
  {
    slug: "the-connaught-london",
    name: "The Connaught",
    city: "London",
    region: "london",
    address: "16 Carlos Place, Mayfair, London",
    postcode: "W1K 2AL",
    nearestStation: "Bond Street (5 min walk)",
    openedYear: "1815 (original); current building 1897",
    architect: "Isaacs and Florence (original); Guy Oliver (2007 restoration)",
    listedStatus: "Grade II",
    rooms: "121 rooms and suites",
    restaurants: ["Hélène Darroze at The Connaught", "Jean-Georges at The Connaught", "The Connaught Grill"],
    bars: ["The Connaught Bar", "The Red Room", "The Champagne Room"],
    owner: "Maybourne Hotel Group",
    operator: "Maybourne Hotel Group",
    oneLiner: "Mayfair's most residential-feeling grand hotel, home to a three-Michelin-star restaurant and a bar repeatedly ranked the world's best.",
    architectureHistory: "The site originally housed two Georgian buildings operating as the Prince of Saxe-Coburg Hotel from 1815. As part of the 1st Duke of Westminster's broader redevelopment of the Mayfair estate, the Georgian structures were demolished in 1894 and the current building opened in 1897 as the Coburg Hotel. In 1917, anti-German sentiment during the First World War forced a renaming. The hotel was rebranded The Connaught in honour of Prince Arthur, Duke of Connaught, Queen Victoria's third son. A £70 million restoration was completed in 2007, refurbishing 88 original rooms and adding 31 new ones. The front forecourt features an installation titled Silence by the Japanese architect Tadao Ando: a shallow water feature with 25 vertical jets, commissioned for the 2011 reopening.",
    brief: [
      "The Connaught is the Maybourne group's smaller, quieter counterweight to Claridge's. Same ownership, same operating standard, deliberately different atmosphere. Where Claridge's leans Art Deco and public-facing, The Connaught is late-Victorian red brick outside, dark wood and warm interiors inside, and feels, by design, more like a grand private house in Mayfair than a hotel. The 1920s mahogany staircase in the main hall runs through all seven floors and is the closest thing the building has to a landmark feature; otherwise it is deliberately understated.",
      "The hotel sits on Carlos Place, which is not a through-road. The semicircular forecourt with the Ando water installation means arrivals are buffered from traffic. The immediate surroundings are some of the quietest streets in central London, which is notable because they are also some of the most expensive: Mount Street runs alongside (Scott's, George, Marc Jacobs, Balmain, most of London's luxury fur and leather trade), and the Connaught Village shops are a three-minute walk. You can walk to Hyde Park in seven minutes and not pass a chain store.",
      "The culinary program is where the hotel's reputation has solidified over the past decade. Hélène Darroze at The Connaught holds three Michelin stars, one of only a handful of London restaurants to do so, and is widely considered among the most refined French-influenced restaurants in the country. Jean-Georges at The Connaught occupies the all-day dining room with floor-to-ceiling windows onto Mount Street. The Connaught Grill, restored in 2021, handles the traditional British cookery.",
      "The Connaught Bar, opened in 2008 and designed by David Collins, has been named the World's Best Bar in the 50 Best Bars rankings multiple times (2020, 2021), placing it first globally. The Martini Trolley service, which Collins originated, has been copied to the point of becoming its own genre; the original is still the best-executed. The Red Room, a separate bar opened in 2021, handles a more experimental cocktail program.",
      "The rooms are the hotel's most divisive element, depending on which side of the renovations you sit on. The 2007 restoration, overseen by Guy Oliver, restored them to a late-Edwardian English country-house vocabulary: muted colours, antique furniture, heavy curtains, real fireplaces in some suites. People who want a crisp, modern hotel room find it old-fashioned. People who want a hotel that feels like it belongs to its building find it exactly right. The Aman Spa operates the wellness floor, including a 12-metre indoor pool, a sauna, and a hammam.",
      "Documented residents include Edward VII, Charles de Gaulle, Princess Grace of Monaco, and Ralph Lauren. The actor Alec Guinness used the hotel as his London residence from the 1970s until his death in 2000, typically entertaining in the private dining rooms. The hotel's art collection, assembled across the 2007 refurbishment, includes documented works by Damien Hirst, Louise Bourgeois, and Barbara Hepworth distributed across the public rooms.",
      "The Connaught suits people who want Mayfair at its least demonstrative: a short walk from the shopping but shielded from it, quiet at night, dining program that holds its own against any in the city, bar that draws its own destination traffic. It does not suit anyone who wants to be near the river, near the theatres, or in a hotel that announces itself.",
    ],
    stayWardNote: "The Connaught, like Claridge's, is part of Maybourne and operates under strict rate parity across public channels. A private rate for a specific traveller is contractually permitted and routinely offered on shoulder-season midweek dates. When we ask on behalf of a traveller, private rates we have been quoted have typically landed 10 to 18 per cent below the public parity rate, sometimes with added inclusions such as breakfast, a bar credit, or a guaranteed early check-in. Not guaranteed. Hotels decide case by case.",
    siblings: ["claridges-london", "the-savoy-london", "the-ritz-london", "the-dorchester-london"],
  },
  {
    slug: "the-ritz-london",
    name: "The Ritz London",
    city: "London",
    region: "london",
    address: "150 Piccadilly, London",
    postcode: "W1J 9BR",
    nearestStation: "Green Park (2 min walk)",
    openedYear: "1906",
    architect: "Charles Mewès and Arthur Davis",
    listedStatus: "Grade II",
    rooms: "136 rooms and suites (25 suites)",
    restaurants: ["The Ritz Restaurant", "The Palm Court"],
    bars: ["The Rivoli Bar"],
    owner: "Abdulhadi Mana Al-Hajri",
    operator: "The Ritz London (independent)",
    oneLiner: "Louis XVI Piccadilly palace opened in 1906, one of Britain's earliest steel-frame buildings, with afternoon tea at the Palm Court and a Grade II listed dining room.",
    architectureHistory: "The Ritz was conceived by César Ritz eight years after he opened the Hôtel Ritz Paris, and the London building was one of the earliest substantial steel-frame structures erected in Britain, engineered by Sven Bylander. The steel frame allowed for expansive, column-free interior volumes that define its Louis XVI aesthetic. Architects Charles Mewès and Arthur Davis designed both the Paris and London Ritz in the same French neoclassical vocabulary. Demolition of the prior Bath Hotel commenced in 1904; The Ritz opened on 24 May 1906. Exterior Grade II listed. The adjacent William Kent House, acquired by the hotel after a century-long land dispute, is Grade II* listed.",
    brief: [
      "The Ritz is the most recognisable hotel building on Piccadilly and probably in London. The colonnaded arcade along its Piccadilly facade, lifted directly from the Rue de Rivoli in Paris, was deliberately un-English; César Ritz wanted a Parisian palace hotel on Green Park and got exactly that. The building's steel frame, unusual in 1906, allowed Mewès and Davis to design the vast, column-free Palm Court and the Marie Antoinette Suite on a scale that earlier London hotels could not accommodate.",
      "It sits directly on Green Park, which means the north-facing rooms look across unbroken parkland to Buckingham Palace. The Palace itself is a seven-minute walk. Burlington Arcade, the Royal Academy, Fortnum & Mason, and the galleries of Cork Street are all within five minutes. Green Park station on the Piccadilly, Victoria, and Jubilee lines is two minutes on foot.",
      "The hotel's cultural footprint is exceptional even by London grand-hotel standards. Its name generated the English adjective ritzy. Irving Berlin wrote Puttin' on the Ritz after a stay. Charlie Chaplin stayed in the Regal Suite in 1921. The Aga Khan maintained a suite for 40 years. During the Second World War, Winston Churchill, Dwight Eisenhower, and Charles de Gaulle met in the Marie Antoinette Suite to coordinate military operations; during the First, David Lloyd George used the hotel for secret meetings. Queen Elizabeth the Queen Mother was a regular guest until her death. The Trafalgar Suite was used as the location for the Anna Scott press conference scene in the 1999 film Notting Hill.",
      "The rooms are uniformly Louis XVI in vocabulary: gilt mirrors, marble fireplaces, heavy silk curtains, oil portraits, chandeliers that would feel theatrical anywhere else. The hotel has resisted the general drift toward a more muted contemporary aesthetic that Claridge's, the Connaught, and Rosewood have all embraced. If you want a room that feels like a room in a French palace, The Ritz delivers that more completely than any other hotel in London.",
      "The Ritz Restaurant, which opened with the hotel in 1906, is one of London's most formal dining rooms. Its gilded interior is itself Grade II listed, meaning the restaurant is one of the most architecturally protected dining spaces in the country. The Palm Court serves afternoon tea across five daily sittings, all of which book out weeks in advance; a dress code is enforced. The Rivoli Bar, a later Art Deco addition in 2001, was designed by Tessa Kennedy to resemble a carriage of the Orient Express.",
      "The Ritz suits grand-occasion stays, state-visit-scale formality, afternoon tea as a standalone event, and anyone who wants a Parisian hotel experience on the British side of the Channel. The dress code (jackets required after 6pm in public rooms, no sportswear in the restaurant) is genuinely enforced. It does not suit anyone looking for informality or a contemporary aesthetic.",
    ],
    stayWardNote: "The Ritz London operates on strict rate parity with major booking channels, which is why searches on Booking.com, Expedia, and theritzlondon.com return identical headline rates. Parity contracts carve out a specific exception for private rates offered directly to individual travellers. When we ask on behalf of a traveller, private rates we have been quoted at The Ritz on shoulder-season midweek dates have typically landed 8 to 15 per cent below the public parity rate. The Ritz is less flexible than the Maybourne hotels on discounting but occasionally includes afternoon tea or breakfast in a private quote. Not guaranteed.",
    siblings: ["the-savoy-london", "claridges-london", "the-connaught-london", "the-dorchester-london"],
  },
  {
    slug: "the-dorchester-london",
    name: "The Dorchester",
    city: "London",
    region: "london",
    address: "53 Park Lane, London",
    postcode: "W1K 1QA",
    nearestStation: "Hyde Park Corner (6 min walk); Marble Arch (8 min)",
    openedYear: "1931",
    architect: "Sir Owen Williams (initial); William Curtis Green (final)",
    listedStatus: "Grade II",
    rooms: "250 rooms (49 suites)",
    restaurants: ["Alain Ducasse at the Dorchester", "The Grill at The Dorchester", "The Promenade", "China Tang at The Dorchester", "The Spatisserie"],
    bars: ["Vesper Bar", "The Bar at The Dorchester"],
    owner: "Brunei Investment Agency",
    operator: "Dorchester Collection",
    oneLiner: "Park Lane modernist landmark opened 1931, built in reinforced concrete, home to one of London's three-Michelin-star restaurants.",
    architectureHistory: "The Dorchester replaced Dorchester House, a mid-nineteenth-century mansion demolished in 1929. The construction was led by Sir Robert McAlpine and Sons using reinforced concrete, which was still novel for large-scale London buildings at the time. The concrete frame allowed for massive, column-free interior spaces and an exceptionally rapid construction timeline: the upper eight floors were built in ten weeks. The reinforced concrete shell also made the building one of the safest in central London during the Second World War, which drew an extensive military and political clientele during the Blitz. Grade II listed, January 1981. Major refurbishments by Pierre-Yves Rochon and Martin Brudnizki completed in 2023.",
    brief: [
      "The Dorchester is the only London grand hotel built in the twentieth century that is held in the same category as the Victorian and Edwardian Grande Dames. That status was not initially obvious. When it opened in 1931, its reinforced-concrete modernism read as aggressively contemporary against Park Lane's mostly Edwardian silhouette. Ninety years later, its 1930s modernism has itself become historic, and the hotel now reads as continuous with the older category rather than a break from it.",
      "The building faces Hyde Park directly across Park Lane. The park-facing suites look across roughly 100 metres of lawn to the Serpentine in one direction and to the Wellington Arch in the other. The Park Lane elevation, because it sits on one of London's busiest roads, is not a quiet one; the park-facing side is insulated but the road is audible in spring and summer when windows might be open. A mature plane tree in the front garden was designated one of the Great Trees of London in 1997.",
      "The hotel's war record gives it some of its most documented history. Dwight Eisenhower took up residence in 1944 while planning the Normandy landings. Princess Elizabeth stayed the night before her engagement to Prince Philip was publicly announced in 1947, and Prince Philip held his stag party at the hotel the night before their wedding. The Dorchester was the London social nexus for Elizabeth Taylor, Richard Burton (who spent considerable time there during their two marriages), Somerset Maugham, and the poet laureate Cecil Day-Lewis. In 2003, Roman Abramovich and Ken Bates met in the hotel to execute the sale of Chelsea Football Club.",
      "The culinary program is anchored by Alain Ducasse at the Dorchester, which holds three Michelin stars and is one of three London restaurants at that level. The Grill at the Dorchester handles the traditional British service; the Promenade serves a particularly theatrical afternoon tea; China Tang, installed by Sir David Tang in 2005, is a dedicated Cantonese restaurant occupying its own separate Park Lane entrance. The total dining and bar offering, at five restaurants and two bars, is the largest of any London grand hotel.",
      "The recent refurbishment cycle completed in 2023 was extensive. Pierre-Yves Rochon reworked most of the rooms and suites in a palette that is warmer and less overtly gilded than the pre-2020 interiors. Martin Brudnizki redesigned the public bars and the Promenade. The architectural shell and the famous Oliver Messel suite (designed by the theatrical designer in the 1950s) were preserved intact.",
      "The ownership by the Brunei Investment Agency since 1985 has been the hotel's single most controversial aspect. The 2019 introduction of sharia-based penal laws in Brunei prompted international boycott campaigns that included the Dorchester Collection's other properties. Many corporate accounts quietly avoided the hotel during that period.",
      "The Dorchester suits park-facing stays, Ducasse-anchored dining trips, grand social occasions, and anyone who wants 1930s modernism rather than Victorian grandeur. It does not suit anyone prioritising absolute quiet, or anyone for whom the Brunei ownership is a material concern.",
    ],
    stayWardNote: "The Dorchester operates rate parity with all major booking channels, with the standard OTA carve-out for private rates offered directly to individual travellers. When we ask on behalf of a traveller, private rates we have been quoted on shoulder-season midweek dates have typically landed 10 to 18 per cent below the public parity rate, sometimes with breakfast or a park-facing upgrade included. The hotel has been noticeably more flexible on private rates since 2019 when corporate occupancy dropped. Not guaranteed.",
    siblings: ["the-savoy-london", "claridges-london", "the-connaught-london", "the-ritz-london"],
  },
  {
    slug: "the-langham-london",
    name: "The Langham",
    city: "London",
    region: "london",
    address: "1C Portland Place, Regent Street, London",
    postcode: "W1B 1JA",
    nearestStation: "Oxford Circus (4 min walk)",
    openedYear: "1865",
    architect: "John Giles and James Murray",
    listedStatus: "Grade II",
    rooms: "380 rooms",
    restaurants: ["Roux at The Landau", "Palm Court", "The Wigmore"],
    bars: ["Artesian", "The Wigmore"],
    owner: "Great Eagle Holdings / Langham Hospitality Group",
    operator: "Langham Hospitality Group",
    oneLiner: "Europe's first true Grand Hotel, opened 1865 at the top of Regent Street, birthplace of the English afternoon tea.",
    architectureHistory: "The Langham opened on 10 June 1865 and was recognised commercially upon its debut as Europe's first true Grand Hotel, designed to centralise London aristocratic social functions at a scale that had not previously existed in any British hotel. It incorporated cutting-edge Victorian technology including early hydraulic lifts and rudimentary air conditioning, benchmarks that later properties like The Savoy would attempt to surpass. During the Second World War, a Luftwaffe bombing raid destroyed a substantial section of the west wing. After the war the hotel closed and the building was acquired by the BBC, which used it for office space, studios, and the BBC Club for several decades before the building returned to hotel use under the Langham Hospitality Group in the mid-1980s. Grade II listed.",
    brief: [
      "The Langham invented the London grand hotel category. In 1865, when it opened at the top of Regent Street on land released from Queen Victoria's personal estate, there was no other hotel in Britain or Europe at that scale: 600 rooms, 100 water closets, 36 bathrooms, hydraulic lifts, its own electrical generators, and a dining room that could seat 200. The Prince of Wales attended the opening. The Savoy would not open for another 24 years. The Ritz would not open for another 41.",
      "Its cultural register from that first period is extraordinary. Louis Napoléon III lived here during his French exile. Mark Twain stayed in 1873 and 1874. Arthur Conan Doyle attended a dinner here in 1889 that produced both The Sign of Four (commissioned from Doyle over dinner) and The Picture of Dorian Gray (commissioned from Oscar Wilde at the same meal); Doyle subsequently used The Langham as the setting for three Sherlock Holmes stories, including The Sign of Four itself. Charles Dickens, in his 1879 London guide, described The Langham as serving the most expensive hotel meal in the capital. Antonín Dvořák composed at the hotel. Oscar Wilde was a regular. Noël Coward was a resident.",
      "The hotel effectively invented the English afternoon tea in its Palm Court in the 1860s; the ritual as it now exists, sandwiches first, then scones, then patisserie, with a specific china service and a specific tea sequence, was codified in this room. The Palm Court still serves afternoon tea daily and remains the most historically continuous version of the meal in London.",
      "The Second World War nearly ended the hotel. A bombing raid destroyed the west wing and a substantial portion of the ground floor. After the war the building was briefly considered unsalvageable as a hotel and was acquired by the BBC, which used it for several decades as office space, studios, and the BBC Club. It was only in the mid-1980s that the building returned to hotel use, under the Langham Hospitality Group (part of Hong Kong-based Great Eagle Holdings), which remains the operator today.",
      "The rooms, following the Langham group's Hong Kong sensibility, are more contemporary than at the older London grandes dames: a warmer, less gilded vocabulary with Asian influences in the suite designs. The Chuan Spa, a 21-metre pool, and the fitness floor added in the 2000s are larger than at any other central London grand hotel except the Berkeley. Roux at The Landau holds the fine dining reputation; the Artesian bar, repeatedly ranked in the World's 50 Best in the mid-2010s, is in a second phase under a new bar director.",
      "The location, at the junction of Portland Place, Regent Street, and Langham Place, is the top of central London's retail spine and the beginning of the quieter medical and residential district of Marylebone to the north. Oxford Circus is four minutes' walk south. Regent's Park is eight minutes north. The BBC's Broadcasting House sits directly across Portland Place, which is visible from most of the hotel's front-facing rooms.",
      "The Langham suits guests who want a hotel with a longer historical register than any other in London, afternoon tea in its original room, a larger-than-average spa and pool, and a location closer to shopping than to the river. It does not suit anyone looking for Mayfair-level quiet; the Regent Street junction is busy.",
    ],
    stayWardNote: "The Langham operates rate parity across all major booking channels. The standard OTA contract exception for private rates applies. When we ask on behalf of a traveller, private rates we have been quoted on shoulder-season midweek dates have typically landed 12 to 22 per cent below the public parity rate, sometimes with added breakfast or a higher-floor upgrade. The Langham is one of the more flexible London grand hotels on private rates, possibly because its 380-room scale makes per-room yield less sensitive than at the smaller Maybourne properties. Not guaranteed.",
    siblings: ["the-savoy-london", "claridges-london", "the-connaught-london", "the-ritz-london"],
  },
]

export function getHotel(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug)
}

export function getHotelsByRegion(region: string): Hotel[] {
  return hotels.filter((h) => h.region === region)
}
