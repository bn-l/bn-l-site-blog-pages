---
title: Various opaque errors encountered when working in Visual Studio using the dotnet framework"
description: "I encoutered this errror when testing a .NET 6 app in VSCode and found a solution"
date: 23-01-23
draft: false
page_type: post
permalink: "posts/various-opaque-dotnet-errors-visual-studio"
---

Every small change made in the visual studio GUI seems to create some opaque error somewhere. Double clicking on the error sometimes does nothing and sometimes links to an irrelevant and enormous xml file. I'm new to dotnet (and visual studio) but I really don't understand the point of this. You are going to have to access the internals at some point, so the GUI adds a further layer of complexity that seems to make things harder by trying to simplfiy. I'm probably missing something (the debugging and profiling seem really powerful —but it's not unique to VS).

The following are some opaque errors that were unsolvable by clicking on the error message or looking up the error reference or searching the docs, and required very deep googling and trial and error to fix.



**Warning MSB3270 There was a mismatch between the processor architecture of the project being built "MSIL" and the processor architecture of the reference**

- :warning: Full error:

```
Warning	MSB3270	There was a mismatch between the processor architecture of the project being built "MSIL" and the processor architecture of the reference "C:\path\to\the.dll", "AMD64". This mismatch may cause runtime failures. Please consider changing the targeted processor architecture of your project through the Configuration Manager so as to align the processor architectures between your project and references, or take a dependency on references with a processor architecture that matches the targeted processor architecture of your project.	Tests	E:\VisualStudio\MSBuild\Current\Bin\amd64\Microsoft.Common.CurrentVersion.targets	2302 
```

- :information_source: Explanation:
    - The "solution" has two siblings "projects". One project's PropertyGroup element (in .csproj) specified a PlatformTarget and the other didn't. 
    - So the error means that one project is which is being built for the "architecture" [MSIL](https://archive.ph/XtWjJ) (not an architecture and actually renamed [CIL](https://archive.ph/jnPyi) but an "intermediate language") (see also [here](https://learn.microsoft.com/en-us/dotnet/standard/managed-execution-process))

- :white_check_mark: Fix:
    - Remove the PlatformTarget "property" (AKA [xml element](https://www.w3.org/TR/xml/#elemdecls:~:text=%5BDefinition%3A%20Each%20XML%20document%20contains%20one%20or%20more%20elements%2C)) in all csproj files or make the line the same in all.



**VSCode Error: "The type or namespace name 'VisualStudio' does not exist in the namespace 'Microsoft' vscode"**

- :warning: Full error:

```
The type or namespace name 'VisualStudio' does not exist in the namespace 'Microsoft' vscode
```

running:

```shell
dotnet test
```

…worked fine.

- :white_check_mark: Fix: 
    - To solve this I added the "MSTest.TestFramework" package from nuget:

```shell
dotnet add package MSTest.TestFramework
```

This is my first time testing in VSCode. The [docs](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest) give instructions to add the following to the csproj in the Test folder:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.NET.Test.Sdk" Version="16.7.1" />
  <PackageReference Include="MSTest.TestAdapter" Version="2.1.1" />
  <PackageReference Include="MSTest.TestFramework" Version="2.1.1" />
  <PackageReference Include="coverlet.collector" Version="1.3.0" />
</ItemGroup>
```

Which didn't help VSCode.



