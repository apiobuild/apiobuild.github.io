---
title: What Does Data Mesh Do and Don't Do?
description: Should you adopt data mesh for your business or organization? This article explores the balance between federation and governance to improve development velocity.
author: Lulu Cheng
authorLink: https://l1990790120.github.io/about
date: 2024-07-01
img: https://images.pexels.com/photos/7369/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
tags: ["Data Mesh", "Business"]
---

Around 2011, a viral concept called [Microservices](https://microservices.io/) was created. The high-level idea is that software used to be built and released together. Imagine every app on your phone is built together and only gets new update every 6 months. When app A implements a new feature, the app A team has to ask app B, C, D...Z if they are ALL ready for a new release. This was acceptable in the early days when software was distributed by CD-ROMs. Remember this thing?

![CD-ROM](https://images.pexels.com/photos/9002522/pexels-photo-9002522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

Five years later, almost everyone has a project on their resume where they "break monoliths into microservices". This involved separating the tangled code of a giant codebase so that individual functionalities could be worked on independently by much smaller teams. Today, most teams own more than several microservices; it has reached the point where one person can own several microservices. At one point, [Uber even shared an article talking about how having too many microservices can actually be counterproductive](https://highscalability.com/one-team-at-uber-is-moving-from-microservices-to-macroservic/).

Why is this relevant? In 2020, [Zhamak Dehghani first wrote about the concept of data mesh](https://martinfowler.com/articles/data-mesh-principles.html). At the time, I read the article several times and I couldn't quite understand what problem this architecture is trying to explain or solve. Fast forward to today, data mesh has become a [full-blown consulting service](https://www.thoughtworks.com/what-we-do/data/data-mesh#fourprinciples) that promotes four principles: Domain ownership, Data as a product, Self-service data platforms, Federated computational governance.

From many discussions with my peers and friends in the industry, I understand data mesh in practice as the following: as a data infrastructure and platform engineer, I'm trying to build the lowest common denominator components for different business and engineering teams so that they could build data pipelines and products on their own with proper security and governance. Essentially, instead of having a centralized data team, which is actually very common in practice, business orgs or even individual teams are capable of building data products on their own. What I realized is this is actually quite challenging. Not because we cannot build, but many of the centralized functionality related to governance and security are hard to implemented in a federated fashion.

In theory, data mesh makes a lot of sense. As an infrastructure and platform engineer, we've always strived to automate infrastructure provisioning as much as possible. Yes, of course it'll be great if every developer knows how to do encryption, how to implement proper security controls, how does Kafka work, what's the difference between stream and queue, what's the difference between Spark streaming and Flink, how to choose between iceberg and DLT, but the reality is... they don't, and why would they?

[Kubernetes](https://kubernetes.io/) was created to reduce the overhead for app developers to set up infrastructure resources for their applications so they only have to focus on application code. Containerization and container workload orchestration have made application deployment so simple that developers rarely have to venture outside of their application code. The real question is, can we repeat the container model in data infrastructure?

## Data Infrastructure is More Complicated than Applications

Most applications can be wrapped into containers and run anywhere. Even very complex distributed infrastructure deployment can be wrapped in helm charts. However, data infrastructure often spans beyond [Kubernetes](https://kubernetes.io/). Many data pipelines are tied to cloud vendors (AWS, GCP, Azure etc.), specific solution vendors (Databricks, Snowflake, Confluent etc.). It's not quite realistic nor cost-effective to "wrap data pipelines into a deployable system onto any environment". More often than not, data pipeline implementations are highly customized to individual teams' preferences. They are often not consistent from one team to another even if they are using similar vendors and stacks. The present challenges in data infrastructure and platform management are often less about flexibility and more about the lack of consistency in implementation leading to challenges in security, governance, traceability, etc.

## "Federated Governance" is Easier Said than Done

Governance and federation are on two extremes of the scale. Shared layers of abstractions and consistent implementations are essential to create proper governance, control, and security. For application or product teams, we can often measure developer velocity by the number of features released. Microservices have indeed shortened development cycles by allowing teams to work independently on different parts of an application.

Data products, however, are different. For example, consider financial services: banks provide similar services such as savings and checking accounts, but each bank manages its own data independently. Before [Plaid](https://plaid.com/) existed, building financial data products based on personal banking data was challenging because the data formats and schemas were too different between different banks. [Plaid](https://plaid.com/) introduced an abstraction and standardization layer that allowed data from all banks to be exchanged and understood in a relatively consistent form.

In the case of data products, the difficulty in development often originates not from the lack of federation but from the lack of standards and consistency. [Zelle](https://www.zellepay.com/) is another example. Moving money across different regions of the world or even within one country can sometimes be difficult to implement, not due to a lack of federation, but due to the absence of standardization, making governance and implementation across financial institutions challenging.

In short, developer velocity in data products doesn’t necessarily come from federation. Instead, better consistency and standardization lead to improved governance, control, and security, making it possible to create data products.

::LetsTalkAndSubscribe{ctaText="Need help on data infrastructure and platform architecture? We are always up for a chat.." subscribeText="Subscribe to our Newsletter"}  
::

## Summary

We are not here to suggest all data platforms should be implemented the same way to optimize for governance and security. Instead, we wanted to point out it's important for businesses and organizations to take a closer look at what's really the bottleneck to create value with data. In many cases, it's not necessarily that developers don't have access to or are unable to use the toolings of their preference. Instead, we see spaghetti data tech stacks because of lack of consistency and standardization across teams in implementations. Instead of advocating for federation or governance directly, we suggest businesses focus on creating the right software abstractions that enable data and AI/ML developers to build faster while ensuring there's a path to create integrations between businesses, products, and teams (which is often enabled by proper discovery and clear governance and security policies).