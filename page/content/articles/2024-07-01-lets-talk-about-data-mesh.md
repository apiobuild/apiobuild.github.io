---
title: What does Data Mesh Do and Don't Do?
description:
author: Lulu Cheng
authorLink: https://l1990790120.github.io/about
date: 2024-07-01
img: https://images.pexels.com/photos/7369/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
tags: ["Data", "Busines"]
---

Around 2011, there's this viral term called [Microservices](https://microservices.io/). The high level idea is that software used to be built and released together. Imagine every app on your phone is built together, when app A implements a new feature, app A team has to ask app B, C, D...Z if they are ALL ready for a new release. This was ok in the earlier days when software was distributed by CD-ROMs. Remember this thing?

![CD-ROM](https://images.pexels.com/photos/9002522/pexels-photo-9002522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

Five years later, almost everyone has a project on their resume to "break monolithe". Basically separate the tangled code of giant code based so that individual functionality can be worked on independently by a much smaller team. Today, most teams own more than several microservices, it gets to the point where one PERSON owns more than one microservice.

Why is this relevant? In 2020, [Zhamak Dehghani first wrote about the concept of data mesh](https://martinfowler.com/articles/data-mesh-principles.html). At the time, I read the article several times and I couldn't quite understand what problem this architecture is trying to explain or solve. Fast forward to today, data mesh has become a [full-blown consulting service](https://www.thoughtworks.com/what-we-do/data/data-mesh#fourprinciples) that promotes four principals: Domain ownership, Data as a product, Self-service data platforms, Federated computational governance.

From many discussions with my peers and people in the industry, I understand data mesh in practice as the following: as a data infrastructure and platform engineer, I'm trying to build the lowest common demoninator components for different business and engineering teams so that they could build data pipelines and products on their own with proper security and governance. Essentially, instead of having a centralized data team, which is actually very common in practice, business orgs or even individual team is capable of building data product on their own.

In theory, this makes a lot of sense. As an infrastructure and platform engineer, we've always strived to automate infrastructure provisioning as much as possible. Yes, of course it'll be great if every developer knows how to do encryption, how to implement proper security controls, how does Kafka work, what's the difference between stream and queue, what's the difference between Spark streaming and Flink, how to choose between iceberg and DLT, but the reality is.. they don't, and why would they?

The existence of Kubernetes is to reduce the overhead for app developers so that they can configure one thing: name of their image. Sometimes app developers step outside of their comfort zone
