---
title: Latex 图片表格排版记录
index_img: /gallery/covers/latex.png
banner_img: /gallery/covers/latex.png
toc: true
date: 2021-08-30 11:00:00
updated: 2022-05-30 11:00:00
category:
- Programming
tags:
- latex
---

<!-- omit in toc -->
此处记录一些 Latex 的用法。

<!-- more -->

## 图片排版

### 子图排版

涉及子图的图片排版可以参考[此链接](https://blog.csdn.net/a6822342/article/details/80533135)。
在此就不再赘述。

### 将图片放置于表格中

``` LaTeX
\begin{table}
   \centering
   \caption{The table of figures}
   \hspace*{-0.15\linewidth}
   \begin{tabular}{cM{0.25\linewidth}M{0.25\linewidth}M{0.25\linewidth}M{0.25\linewidth}}
      \toprule
        & A                                              & B                                              & C                                              & D                                              \\
      \midrule
      K & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} \\
      L & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} \\
      M & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} \\
      N & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} & \includegraphics[width=\linewidth]{figure.png} \\
      \bottomrule
   \end{tabular}
   \label{table:table-of-figures}
\end{table}
```

### 子图超出行宽强制不换行

这个需求是因为在写文章时有时模版会在子图间加距离，导致按比例设置大小的子图超出行距换行。
另一种情况就是有时我们需要稍外超出一些行距来使图片更大一些。
一般来说这里需要使用到 `\makebox` 命令。

``` LaTeX
\begin{figure}
   \centering
   \makebox[\textwidth][c]{
   \subfigure[Caption A]{
      \begin{minipage}[b]{0.3\linewidth}
         \includegraphics[width=1\textwidth]{figure/digit_best.png}
      \end{minipage}
   }
   \hspace{-0.05\linewidth}
   \subfigure[Caption B]{
      \begin{minipage}[b]{0.3\linewidth}
         \includegraphics[width=1\textwidth]{figure/amazon_best.png}
      \end{minipage}
   }
   \hspace{-0.05\linewidth}
   \subfigure[Caption C]{
      \begin{minipage}[b]{0.3\linewidth}
         \includegraphics[width=1\textwidth]{figure/office_best.png}
      \end{minipage}
   }
   \hspace{-0.05\linewidth}
   \subfigure[Caption D]{
      \begin{minipage}[b]{0.3\linewidth}
         \includegraphics[width=1\textwidth]{figure/imageCLEF_best.png}
      \end{minipage}
   }}
   \caption{A box of figures.}
   \label{fig:box-figures}
\end{figure}
```

### 子图引用

如果是单张子图，可以直接引用 `Fig.~\ref{子图}`。
如果是多张子图，可以使用 `Fig.~\ref{主图}\subref{子图1}\subref{子图2}` 来进行引用。（但是这个方法无法放到同一个括号里。）

## 表格排版

### 竖排表格中的文本

``` LaTeX
\rotatebox{90}{some rotated text}
```

### 表格中文本加粗

通常情况下加粗后会使文本变宽，导致表格无法对齐。
[前人](https://blog.csdn.net/a411358606/article/details/120121332)也遇到过这个问题，并尝试了了不同的加粗命令，发现使用`\pmb`可以避免文本变宽情况出现。