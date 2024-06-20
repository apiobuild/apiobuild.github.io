---
title: Proliferation of Data Platforms and Infrastructure
description: With an explosive number of data infrastructure and platform tools and vendors, we should supposedly benefit from the competition in the industry, but why is our life not easier?
author: Lulu Cheng
authorLink: https://l1990790120.github.io/about
date: 2022-08-25
img: https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
tags: ["Data", "Infrastructure"]
---

There is an explosive number of data infrastructure and platform tools and vendors: Spark on Databricks vs. EMR vs. Snowflake, Kafka or Flink on Confluent vs. MSK, Splunk vs. Datadog vs. Elk. As customers, we should supposedly benefit from the sheer competition in the industry, lowering our costs and simplifying our tech stack. Instead, we are constantly migrating from one platform or technology to another, building and supporting ever-increasing complexity, and losing flexibility and development velocity due to the highly wrapped nature of today's vendor-offered platform tools.

## Evolution of Data Platform Tools

### Open Source Software

In the past, data engineers relied heavily on open-source tools. Major vendors today often started with open-source software: Airflow([Preset](https://preset.io){target="\_blank"}), Kafka ([Confluent](https://www.confluent.io/){target="\_blank"}), Spark ([Databricks](https://databricks.com/){target="\_blank"}), Presto ([Starburst](https://starburst.io){target="\_blank"}), Elasticsearch ([Elastic](https://www.elastic.co/){target="\_blank"}) etc.

### Cloud Providers

Soon, cloud providers such as AWS and GCP began to wrap open-source software into products such as EMR and MSK. Developers, who aren’t always infrastructure experts, found cloud providers could manage these tools better.

### Vendor Hosted Platforms

The original creators then started offering their own hosted solutions, adding features not available in the cloud versions. Vendors often launch features on their proprietary hosted versions that aren't available in the cloud provider-hosted versions (often based on vanilla open-source versions).

Today, it is rare to see developers deploying distributed software such as RabbitMQ, Spark, Flink, Cassandra, etc., on their own. Most open-source projects now have vendor-hosted options available. With just a few clicks, developers can easily deploy an entire stack within hours, if not minutes. Many of these infrastructure and platform tools are highly distributed and complex, requiring specialized tuning during deployment to achieve optimal performance for various use cases. This is a significant advantage for developers and businesses, as it saves them time and costs.

## Pitfalls of Vendor Managed Platforms

### Increased Complexity

If you ask platform engineers today, their lives are not any easier, if not more difficult. People don't use tools only as they are intended or built for. There are many use cases that are outside of the "typical" usage of these platform tools. People find the shortest path to accomplish what they need to accomplish, and platform engineers have to figure out a way to support them. In order to simplify the deployment and management of these highly sophisticated data infrastructures and platforms, these platform tools are now often highly wrapped by vendors, with not that many toggles left for the platform engineers to tweak.

### Wrapped Solutions

Enterprise software such as Salesforce or Oracle is highly wrapped by the vendor and is neither friendly to developers nor end users. Sure, you can configure applications in almost any way you like; however, it's not easy. There's a whole industry of Salesforce or Oracle consultants **JUST to CONFIGURE** the software. These consultants can't write just any code; they have to write code exactly how Salesforce or Oracle wants them to. The entire consulting industry exists because of the complexity of vendor software. Many data infrastructure and platform tools are heading in a similar direction, where developers are no longer empowered to implement on top of the once open-source solutions.

### Slower Development

Today, if features needed are not on the vendor's roadmap, they often become difficult for developers to build. Vendors love this because businesses are now extremely locked in. This exacerbates to the point where vendors use their platform adoption to make it difficult to either use open-source software or integrate with their competitors. This is especially obvious when there are tools such as Fivetran and Portable that build around the gaps of platforms and maintain the code alongside vendors to fill the gaps for developers.

Taking away developers' power ended up making businesses move slower together. In order to take advantage of X feature that exists on vendor A but not vendor B, developers have two choices: 1. customize vendor B to add such features or 2. migrate from vendor B to vendor A. Many businesses are now very cautious about building new features since they are already paying so much to the vendors and would rather have the vendor do the heavy lifting. Option 1 has become more difficult and costly if implementation is not aligned with the vendor's design, and option 2 is a very costly process. More often than not, we all end up hoping the vendor will eventually implement the feature.

::LetsTalkAndSubscribe{ctaText="We are always happy to chat and see how we can help streamline your data operations and platform vendors." subscribeText="Subscribe to our Newsletter"}
::

## How to Fix This?

## Choose the Right Tool

One would think that standardization and consolidation would eventually happen due to the overwhelming complexity, maintenance, cost, and security considerations. Observability is one of the prime examples where open-source Elasticsearch, Splunk, and Datadog not only coexist but also require constant migrations or custom pipelines between platforms to pass data from one to another. It's a lot more noise to cut through nowadays to know what's the right tool for the job. Kafka is another example, claiming to be the streaming technology that could also be used as task queues. It could, but not quite. In the case where there are bursty requests to reprocess large volumes of tasks, a queue's push and pull architecture is a lot cheaper and easier to operate than Kafka, which is built as a distributed logging system. Missing such simple insights could set back our developer velocity and product feature release for months and sometimes years.

### Revamp Vendor Evaluation Process

Are platform engineers today just glorified operators? In a perfect world where vendor solutions can support every business use case, yes, they can be. However, as it turns out, businesses always find new use cases that vendors can't support, and developers can't effectively build on top of existing vendor solutions. Most businesses evaluate vendors based on two major factors: 1. Features and 2. Cost estimate. In many cases, vendor A and vendor B often aren't so different in terms of offerings. However, what often isn't emphasized is that migrations and vendor stickiness can be cost-prohibitive if there's a changing technology need. In today's world, your business software is a combination of cloud providers, in-house developer code, open-source software, and increasing dependence on vendor solutions. If one of these components can't iterate fast enough, it could greatly slow down your business.

### Simplify Tech Stack

Complexity isn't the most obvious problem of a slow tech stack. It could even provide a false sense of progress and capabilities. Microservice architecture isn't supposed to simplify developers' lives but to increase developer velocity. However, it's important to strike a balance between speed and complexity. Costs associated with complexity such as security, custom processes, complex cross-platform deployment, internal training and education, documentation, etc., are often not easy to quantify. It's important to identify both overlapping use cases and gaps between vendor solutions and recognize when the speed no longer justify the cost and complexity.

::LetsTalkAndSubscribe{ctaText="We are always happy to chat and see how we can help streamline your data operations and platform vendors." subscribeText="Subscribe to our Newsletter"}  
::
