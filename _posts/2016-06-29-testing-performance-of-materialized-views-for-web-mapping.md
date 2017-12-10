---
bg: "tools.jpg"
layout: post
title:  "Testing Performance Of Materialized Views For Web Mapping From A Normalized Database"
crawlertitle: "Testing Performance Of Materialized Views For Web Mapping From A Normalized Database"
summary: "Testing Performance Of Materialized Views For Web Mapping From A Normalized Database"
date:   2016-06-29 20:09:47 +0700
categories: posts
tags: ['database', 'sql']
author: jmapping
---
If you don’t know what materialized views are in PostgreSQL you can read all about them in the official docs. For those of you that don’t want to read the docs I’ll sum it up here.



Materialized views are essentially static snapshots of data created from a normal view-like query.  Rather than a full view query that usually involves multiple table joins for every select statement accessing it a materialized view results in a simple single table-like select with none of the joins used to create the initial materialized views.  It’s important to note that these are not tables… They are different.  For example, unlike a normal table you can refresh the contents of a materialized view with a simple command:

{% highlight js %}
REFRESH MATERIALIZED VIEW mymatview;
{% endhighlight %}

It’s also important to note some basic pros, cons, and ideal use cases for materialized views before moving on.

### Pros

1. They can be very fast compared to a normal view depending on how complex the original view is.
2. They don’t rely on indexes being current.
3. Can save on CPU and memory footprints because of the reduction of query complexity for basic access to that data.

### Cons

1. They can be slow to build initially depending on complexity and size of data.
2. Data captured in the materialized view can get out of date if not refreshed when appropriate for the applications using it.
3. Results in a bit of data redundancy in the system although it isn’t true redundancy because they utilize view-like queries to extract a snapshot of a normalized database.
4. Results in larger storage footprint as they create static snapshots of data.

### Some ideal use cases

1. When needing to access data in a normalized database that requires lots of table joins with relatively large data sets that would otherwise result in slow queries.
2. When the underlying data behind a view is updated at a rate that is significantly lower than the demand to do simple reads on that view.

## The Scenario That Got Me Writing About This

At TerraFrame we build and maintain the open source data engine RunwaySDK which utilizes an ontological approach to managing data (among other things).  This basically boils down to managing data as objects with well defined human like relationships between those objects.  From a developer perspective you can interact with location data in ways that make sense to a human while navigating a location relationship network.  For example, you can easily determine what ancestors, children, or siblings a location might have…. Ohh, and you can do this even if your data doesn’t have any geometry data.

So, to enable this level of flexibility we have a programmatic abstraction that necessitates a highly normalized database.  When we build mapping based apps on RunwaySDK we often access map layer information through database views.  These views are very complex in order to ensure accuracy, ensure the data is current when data is being updated regularly through api’s or other users, and to maintain adherence to the ontological paradigm.  The problem is that rendering map layers from these views can be slower than desired.

Despite what I said above, why use views you might ask?

Well, GeoPrism which is our primary open source application that utilizes RunwaySDK can have data of all types and sizes as well as multiple users modifying and/or viewing the data simultaneously.  Additionally, users can create, filter, and style layers on the fly.  Ensuring performant access to this constantly changing data can be a challenge and views offer the most obvious way to access regularly changing data in a normalized database.  One potential opportunity for performance enhancement in this situation can be found by using materialized views.  After a basic implementation we wanted to test some scenarios to determine their usefulness for improving performance of map layer tile caching as well as basic programmatic access in an app as dynamic as GeoPrism.

## On To The Tests!

The use case I am testing for is pretty simple.  We use GeoServer as a map server to render map layers from a database view (more details below).  The query GeoServer makes to the database to generate the layer service is basically a simple SELECT statement.  So for these tests we will be looking at two primary actions.

1. The performance of constructing the view and materialized view objects.
2. The performance of a basic SELECT statement used to access the view and materialized view.

A standard view in GeoPrism that would be used by GeoServer to create map layers looks like this:

{% highlight js %}
CREATE VIEW lv_8shd315cxqu93yrtwjcsto2iht2xxyk1_8nnoducey3 AS
 SELECT valuequery_26.geoid,
    valuequery_26.displaylabel,
    valuequery_26.populationestimate2015,
    valuequery_26.births2010,
    valuequery_52.geom
   FROM ( SELECT geo_entity_54.geo_id AS geoid,
            geo_entity_54.geo_point AS geom
           FROM geo_entity geo_entity_54) valuequery_52,
    ( SELECT valuequery_1.geoid,
            valuequery_1.displaylabel,
            valuequery_1.populationestimate2015,
            valuequery_27.births2010
           FROM ( SELECT sum(population_by_metropoli_2.population_estimate2015)::numeric(20,2) AS populationestimate2015,
                    COALESCE(geo_entity_display_labe_5.default_locale) AS displaylabel,
                    geo_entity_4.geo_id AS geoid
                   FROM geo_entity geo_entity_4
                     LEFT JOIN geo_entity_display_label geo_entity_display_labe_5 ON geo_entity_4.display_label = geo_entity_display_labe_5.id,
                    population_by_metropolitan_are population_by_metropoli_2
                     LEFT JOIN geo_entity_all_paths_table geo_entity_all_paths_ta_15 ON population_by_metropoli_2.metropolitan_area = geo_entity_all_paths_ta_15.child_term
                  WHERE geo_entity_all_paths_ta_15.parent_term = geo_entity_4.id AND geo_entity_4.universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar AND population_by_metropoli_2.population_estimate2015 > 100000
                  GROUP BY COALESCE(geo_entity_display_labe_5.default_locale), geo_entity_4.geo_id) valuequery_1
             LEFT JOIN ( SELECT sum(population_by_metropoli_28.births2010)::numeric(20,2) AS births2010,
                    COALESCE(geo_entity_display_labe_31.default_locale) AS displaylabel,
                    geo_entity_30.geo_id AS geoid
                   FROM population_by_metropolitan_are population_by_metropoli_28
                     LEFT JOIN geo_entity_all_paths_table geo_entity_all_paths_ta_41 ON population_by_metropoli_28.metropolitan_area = geo_entity_all_paths_ta_41.child_term,
                    geo_entity geo_entity_30
                     LEFT JOIN geo_entity_display_label geo_entity_display_labe_31 ON geo_entity_30.display_label = geo_entity_display_labe_31.id
                  WHERE geo_entity_all_paths_ta_41.parent_term = geo_entity_30.id AND geo_entity_30.universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar AND population_by_metropoli_28.population_estimate2015 > 100000
                  GROUP BY COALESCE(geo_entity_display_labe_31.default_locale), geo_entity_30.geo_id) valuequery_27 ON valuequery_1.geoid::text = valuequery_27.geoid::text) valuequery_26
  WHERE valuequery_52.geoid::text = valuequery_26.geoid::text;

  {% endhighlight %}


As you can see the query powering a standard map layer is pretty complex.  Keep in mind this is accessing raw user data, mapping it against locations stored as geo-ontologies, handling language localization for multi-language deployments, and aggregating user data up to whatever geographic hierarchy the user wants.  So, there is a lot of value being provided through this complex query.



The query plan for this view is similarly complicated and reflects to process being run every time the view is accessed:

{% highlight js %}

"Hash Left Join  (cost=10377.29..10636.76 rows=33 width=597)"
"  Hash Cond: ((geo_entity_4.geo_id)::text = (valuequery_27.geoid)::text)"
"  ->  Nested Loop  (cost=5188.17..5447.19 rows=33 width=577)"
"        ->  HashAggregate  (cost=5187.88..5188.38 rows=33 width=26)"
"              Group Key: COALESCE(geo_entity_display_labe_5.default_locale), geo_entity_4.geo_id"
"              ->  Nested Loop Left Join  (cost=658.79..5187.64 rows=33 width=26)"
"                    ->  Hash Join  (cost=658.38..4999.95 rows=33 width=47)"
"                          Hash Cond: (geo_entity_all_paths_ta_15.parent_term = geo_entity_4.id)"
"                          ->  Nested Loop  (cost=0.42..4335.39 rows=1673 width=73)"
"                                ->  Seq Scan on population_by_metropolitan_are population_by_metropoli_2  (cost=0.00..52.76 rows=350 width=73)"
"                                      Filter: (population_estimate2015 > 100000)"
"                                ->  Index Scan using agz26zyj48b9fke7bydp4kyyr6jxnx on geo_entity_all_paths_table geo_entity_all_paths_ta_15  (cost=0.42..12.19 rows=5 width=130)"
"                                      Index Cond: (child_term = population_by_metropoli_2.metropolitan_area)"
"                          ->  Hash  (cost=653.11..653.11 rows=388 width=69)"
"                                ->  Index Scan using akvnubdg3gy2b5jwh7qmllvaffcr6j on geo_entity geo_entity_4  (cost=0.41..653.11 rows=388 width=69)"
"                                      Index Cond: (universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar)"
"                    ->  Index Scan using geo_entity_display_label_pkey on geo_entity_display_label geo_entity_display_labe_5  (cost=0.41..5.68 rows=1 width=74)"
"                          Index Cond: (geo_entity_4.display_label = id)"
"        ->  Index Scan using ads8lkzy5q6pzzehsi1zh4j9vknjmt on geo_entity geo_entity_54  (cost=0.29..7.82 rows=1 width=41)"
"              Index Cond: ((geo_id)::text = (geo_entity_4.geo_id)::text)"
"  ->  Hash  (cost=5188.71..5188.71 rows=33 width=29)"
"        ->  Subquery Scan on valuequery_27  (cost=5187.88..5188.71 rows=33 width=29)"
"              ->  HashAggregate  (cost=5187.88..5188.38 rows=33 width=26)"
"                    Group Key: COALESCE(geo_entity_display_labe_31.default_locale), geo_entity_30.geo_id"
"                    ->  Nested Loop Left Join  (cost=658.79..5187.64 rows=33 width=26)"
"                          ->  Hash Join  (cost=658.38..4999.95 rows=33 width=47)"
"                                Hash Cond: (geo_entity_all_paths_ta_41.parent_term = geo_entity_30.id)"
"                                ->  Nested Loop  (cost=0.42..4335.39 rows=1673 width=73)"
"                                      ->  Seq Scan on population_by_metropolitan_are population_by_metropoli_28  (cost=0.00..52.76 rows=350 width=73)"
"                                            Filter: (population_estimate2015 > 100000)"
"                                      ->  Index Scan using agz26zyj48b9fke7bydp4kyyr6jxnx on geo_entity_all_paths_table geo_entity_all_paths_ta_41  (cost=0.42..12.19 rows=5 width=130)"
"                                            Index Cond: (child_term = population_by_metropoli_28.metropolitan_area)"
"                                ->  Hash  (cost=653.11..653.11 rows=388 width=69)"
"                                      ->  Index Scan using akvnubdg3gy2b5jwh7qmllvaffcr6j on geo_entity geo_entity_30  (cost=0.41..653.11 rows=388 width=69)"
"                                            Index Cond: (universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar)"
"                          ->  Index Scan using geo_entity_display_label_pkey on geo_entity_display_label geo_entity_display_labe_31  (cost=0.41..5.68 rows=1 width=74)"
"                                Index Cond: (geo_entity_30.display_label = id)"

{% endhighlight %}


### Lets convert this standard view to a materialized view.

To convert this to a materialized view we simply modify the query declaration slightly:

{% highlight js %}
CREATE MATERIALIZED VIEW lv_8shd315cxqu93yrtwjcsto2iht2xxyk1_8nnoducey3 AS
 SELECT valuequery_26.geoid,
    valuequery_26.displaylabel,
    valuequery_26.populationestimate2015,
    valuequery_26.births2010,
    valuequery_52.geom
   FROM ( SELECT geo_entity_54.geo_id AS geoid,
            geo_entity_54.geo_point AS geom
           FROM geo_entity geo_entity_54) valuequery_52,
    ( SELECT valuequery_1.geoid,
            valuequery_1.displaylabel,
            valuequery_1.populationestimate2015,
            valuequery_27.births2010
           FROM ( SELECT sum(population_by_metropoli_2.population_estimate2015)::numeric(20,2) AS populationestimate2015,
                    COALESCE(geo_entity_display_labe_5.default_locale) AS displaylabel,
                    geo_entity_4.geo_id AS geoid
                   FROM geo_entity geo_entity_4
                     LEFT JOIN geo_entity_display_label geo_entity_display_labe_5 ON geo_entity_4.display_label = geo_entity_display_labe_5.id,
                    population_by_metropolitan_are population_by_metropoli_2
                     LEFT JOIN geo_entity_all_paths_table geo_entity_all_paths_ta_15 ON population_by_metropoli_2.metropolitan_area = geo_entity_all_paths_ta_15.child_term
                  WHERE geo_entity_all_paths_ta_15.parent_term = geo_entity_4.id AND geo_entity_4.universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar AND population_by_metropoli_2.population_estimate2015 > 100000
                  GROUP BY COALESCE(geo_entity_display_labe_5.default_locale), geo_entity_4.geo_id) valuequery_1
             LEFT JOIN ( SELECT sum(population_by_metropoli_28.births2010)::numeric(20,2) AS births2010,
                    COALESCE(geo_entity_display_labe_31.default_locale) AS displaylabel,
                    geo_entity_30.geo_id AS geoid
                   FROM population_by_metropolitan_are population_by_metropoli_28
                     LEFT JOIN geo_entity_all_paths_table geo_entity_all_paths_ta_41 ON population_by_metropoli_28.metropolitan_area = geo_entity_all_paths_ta_41.child_term,
                    geo_entity geo_entity_30
                     LEFT JOIN geo_entity_display_label geo_entity_display_labe_31 ON geo_entity_30.display_label = geo_entity_display_labe_31.id
                  WHERE geo_entity_all_paths_ta_41.parent_term = geo_entity_30.id AND geo_entity_30.universal = 'i3n7tzda2ow04gquixyagr7ngfi101ezi1vpa2tywfkq0wgqelwt6ay8b49cnbch'::bpchar AND population_by_metropoli_28.population_estimate2015 > 100000
                  GROUP BY COALESCE(geo_entity_display_labe_31.default_locale), geo_entity_30.geo_id) valuequery_27 ON valuequery_1.geoid::text = valuequery_27.geoid::text) valuequery_26
  WHERE valuequery_52.geoid::text = valuequery_26.geoid::text
WITH DATA;
{% endhighlight %}


This will create the materialized view which is now a snapshot of data.  This means the above query is only run once unless explicitly refreshed or re-created.  Now every time we want access to this view the underlying query will be much more simple.  Here is the query plan for accessing the new materialized view with “SELECT * FROM the_table:

{% highlight js %}
"Seq Scan on lv_8shd315cxqu93yrtwjcsto2iht2xxyk1_8nnoducey3  (cost=0.00..8.50 rows=350 width=71)"
{% endhighlight %}

If you haven’t used the query analysis tools in PostgreSQL to view query plans like this it’s OK.  I’ll spare the technical details.  The important thing to note is that the cost of the query went from 10377.29..10636.76 which is pretty slow and has a lot of uncertainty to 0.00..8.50 which is MUCH better.


OK… Now we have some confidence that the query is going to be faster when hit directly with a basic SELECT statement.  This is a practical test for my use case because this is how GeoServer will be accessing the database to provide map services.  After running the SELECT queries manually some interesting but not so surprising results emerged.

## Basic Test Results:

The Simple Query = SELECT * FROM the_table;

Resulting Row Count = 381 (pretty small)

Time to drop standard view = 14 ms

Time to create standard view = 15 ms

Time to SELECT results from standard view = 43 ms



Time to drop materialized view = 12 ms

Time to create materialized view = 51 ms

Time to SELECT results from materialized view = 31 ms

That’s about a 28% decrease in SELECT time

BUT

about a 286% increase in CREATE time

This is a very basic test on a pretty small dataset but I think it points to what we already suspected and hinted at above.  To gain performance improvements from materialized views there is an up-front cost that must be paid.  The question is if that cost is worth the gain for the use case.  In our case the answer is still maybe.  More testing is needed.  Some of the underlying tables queried are quite large but the resulting output is not.  I plan to run this test again when I integrate some data that will test results in the 10’s – 100’s of thousands or records in the near future.
