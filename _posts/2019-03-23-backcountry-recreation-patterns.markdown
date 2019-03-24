---
bg: "tools.jpg"
layout: post
title:  "Disconnecting From The Wilderness"
crawlertitle: "While the number of recreational travelers are on the rise the number of backcountry travelers are declining. A loss of people with personal experiences in the wilderness could lead to a loss of people personally invested in protecting wild places."
date:   2019-03-23 23:00:00 +0700
categories: posts
tags: 'recreation'
author: jmapping
excerpt: "While the number of recreational travelers are on the rise the number of backcountry travelers are declining. A loss of people with personal experiences in the wilderness could lead to a loss of people personally invested in protecting wild places."
---

In a world where time behind the screen is going up there is a question I've been thinking about for a long time.

#### Are we loosing our ability to defend our natural resources because less people are experiencing these wild places in ways that encourage their help to protect them?

My hypothesis is that those who will truly stand behind political decisions (voting, advocacy, etc..) and those who will promote responsible recreation practices to their peers are those that have had the opportunity to experience the wilderness intimately. To explore this idea a good starting point is to dig into the data. The United States National Parks Department publishes historical data on park usage that I've found useful in starting to understand the initial question of:

#### What have recreational patterns looked like over time?

I downloaded some data from the National Park Service and wrote a processing script to format the data so that I could start to look at recreational use patterns. All the data and processing scripts can be [downloaded here](https://github.com/justinlewis/recreation).


### The total number of recreational visitors per year have generally been on the rise since 1979
This isn't a surprise. Those that have visited a National Park, especially one of the more famous parks, have likely not been alone. In some parks at peak times of the year visitor rates result in dense crowds and traffic jams. A high level look at the data shows the increase in park visitation generally follows the rise in population growth.

[![climber]({{ site.images | relative_url }}/NationalParkRecreationAllTypes(totals).png)]({{ site.images | relative_url }}/NationalParkRecreationAllTypes(totals).png)

<b>About this data & chart:</b>  
* The red line labels as "Recreational Visitors" includes visitors of all types. This means people visiting for the day all the way to back country over night hikers.
* The blue, orange, and green lines at the bottom show three categories of park visitors which I've extracted from all recreational visitors.


### Total backcountry campers (per year) have decreased since 1979
Everyone experiences the natural world in their own way. While one person may get a deep connection by visiting a crowded park for a day another might seek out multi-day trips into the backcountry. Neither is better than the other but I'm willing to presume that those who commit the time, money, and expertise needed to travel in the backcountry are seeking a deep connection to the wilderness. If this is true I would presume that these people are more likely to stand up for protecting these wild places. Unfortunately, it seems like there are less people pursuing backcountry trips in the National Park System than in 1979.

[![climber]({{ site.images | relative_url }}/NationalParkBack-countryCampers1979-2014.png)]({{ site.images | relative_url }}/NationalParkBack-countryCampers1979-2014.png)

<b>About this data & chart:</b>  
* This chart looks at backcountry visitors only.
* The colored lines at the bottom represent a breakdown of park visits for each park in the park system. You can see that there are only a couple parks that stand out above the majority in terms of number of visits per year. The dark blue line is Lake Mead NRA, the grey line is Grand Canyon NP, the turquise line is Glenn Canyon NRA, and the orange line is Yosemite NP.


### Camping across all types have decreased since 1979
It might not seem surprising that backcountry visitors have declined since the world is generally becoming more urban focused. Additionally, technology is gaining the attention of younger generations over the more outdoor focused pursuits of older generations. However, backcountry camping, camping in well established camp grounds next to a car (car camping), and recreational vehicles (RV) camping are also done less in the National Park System than in 1979 despite a rise in recreational visitors and general population growth.

[![climber]({{ site.images | relative_url }}/NationalParkRecreationAllTypes(PercentChangeSince1979).png)]({{ site.images | relative_url }}/NationalParkRecreationAllTypes(PercentChangeSince1979).png)
<b>About this data & chart:</b>  
* Visualizing this data as a percentage change since 1979 helps to see the change since the start of the data collection more clearly than if using total visits.

### What does this tell us?
In general this tells us that National Park camping across all types, especially backcountry camping, has decreased since 1979 despite a rise in population and recreational visitors.

### Limitations of this analysis
There are many limitations to this assessment but some of the biggest are:
* This only includes data for the National Park Service facilities. There is a lot of public and private land in the U.S.A. where people are spending time in which this data does not include.
* Many of the parks where this data is collected require entrance fees which may exclude and/or generally discourage some portion of the population. As a result those people may go to other outdoor recreation areas or may not pursue outdoor recreation at all.
